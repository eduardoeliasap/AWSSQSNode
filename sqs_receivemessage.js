require('dotenv').config({  
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
});

var AWS = require('aws-sdk');

const awsConfig = {
    "region": process.env.REGION,    
    "accessKeyId": process.env.ACCESSKEYID, "secretAccessKey": process.env.SECRETACCESSKEY
};
AWS.config.update(awsConfig);

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var queueURL = process.env.QUEUEURL;

var params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 10,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 30,
 WaitTimeSeconds: 10
};

sqs.receiveMessage(params, function(err, data) {  
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      console.log("Success", data.Messages[0]);      
      var deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      })      
    }
    else {
      console.log("There are not message on queue!");
    }
});
