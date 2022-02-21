'use strict';

const AWS = require('aws-sdk');
const axios = require("axios");
const cheerio = require("cheerio");

const sns = new AWS.SNS();

/**
 * Product URL to fetch
 */
const PEANUT_BUTTER_URL = 'https://www.myprotein.hu/sports-nutrition/termeszetes-mogyorovaj/10530743.html';

const TESTS = [
  // Check if the offer is X FOR Y
  /([0-9 ]+)FOR([0-9 ]+)/ig,
  // Check if the offer is X% OFF
  /([0-9 ]+)%/,
]

/**
 * Fetch offer from myprotein.hu
 * 
 * @returns {Promise<string|undefined>}
 */
const fetchOffer = async () => {
  const response = await axios.get(PEANUT_BUTTER_URL, { timeout: 2000 });

  const offer = cheerio.load(response.data)('#pap-banner-text-value').text().trim();

  if (TESTS.some(test => test.test(offer))) {
    return offer;
  }
}

/**
 * Handler function
 */
module.exports.run = async () => {
  await fetchOffer()
    .then(offer => {
      if (offer) {
        return sns.publish({
          Subject: 'MyProtein offers',
          Message: offer,
          TopicArn: process.env.OFFER_TOPIC_ARN
        }).promise()
      }
    })
    .catch(console.error);
};
