'use strict';

const axios = require("axios");
const cheerio = require("cheerio");

const PROTEIN_URL = 'https://www.myprotein.hu/sports-nutrition/impact-whey-protein/10530943.html';
const PEANUT_BUTTER_URL = 'https://www.myprotein.hu/sports-nutrition/termeszetes-mogyorovaj/10530743.html';

const URLS = [
  PROTEIN_URL,
  PEANUT_BUTTER_URL,
];

const uniqueReducer = (acc, curr) => acc.includes(curr) ? acc : [...acc, curr];

const TESTS = [
  // Check if the offer is X FOR Y
  /([0-9 ]+)FOR([0-9 ]+)/ig,
  // Check if the offer is X% OFF
  /([0-9 ]+)%/,
]

/**
 * Fetch offers from myprotein.hu
 * 
 * @returns {Promise<string|undefined>}
 */
module.exports = async () => {
  const responses = await Promise.allSettled(URLS.map(url => axios.get(url, { timeout: 2000 })));

  responses.filter(({ status }) => status === 'rejected').forEach(response => console.error(response.reason.message));

  const offers = responses
    .filter(item => item.status === 'fulfilled')
    .map(({ value }) => cheerio.load(value.data)('#pap-banner-text-value').text().trim())
    .reduce(uniqueReducer, []);

  return offers.filter((item) => TESTS.some((test) => test.test(item)));
}