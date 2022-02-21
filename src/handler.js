'use strict';

const AWS = require('aws-sdk');

const fetchMPOffers = require("./fetch-mp-offers");

const sns = new AWS.SNS();

/**
 * Handler function
 */
module.exports.run = async () => {
  await fetchMPOffers()
    .then(offers => {
      if (offers.length) {
        return sns.publish({
          Subject: 'MyProtein offers',
          Message: offers.join('\n'),
          TopicArn: process.env.OFFER_TOPIC_ARN
        }).promise()
      }
    })
    .catch(console.error);
};
