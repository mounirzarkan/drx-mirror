'use strict';
const https = require('https');
const axios = require('axios');
const {log} = require('../common/utils/index.js');

class SCConnector {
  constructor(scEndpoint, scApiKey, isScHttpAgent) {
    this.scEndpoint = scEndpoint;
    this.scApiKey = scApiKey;
    this.req = axios.create({});
    this.isScHttpAgent = isScHttpAgent;
  }

  createUrl(countryCode, languageCode) {
    let cc = countryCode.toLowerCase();
    cc = cc === 'uk' ? 'gb' : cc;
    // eslint-disable-next-line no-unused-vars
    const lc =
      languageCode && languageCode.toLowerCase
        ? languageCode.toLowerCase()
        : 'en';
    return `${this.scEndpoint}?sc_apikey=${this.scApiKey}&sc_site=drx-us-en`;
  }

  async getGQLresponse(url, query, variables, requestHeaders) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...requestHeaders
      }
    };

    if (this.isScHttpAgent) {
      config.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });
    }

    const resp = await this.req
      .post(
        url,
        JSON.stringify({
          query,
          variables
        }),
        config
      )
      .then((response) => response.data.data)
      .catch(function (error) {
        log.debug('SCConnector getGQLresponse, error');
        console.error(error);
      });

    log.debug('SCConnector getGQLresponse, resp');
    log.debug(resp);

    return resp;
  }
}

module.exports = SCConnector;
