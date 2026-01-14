'use strict';
const https = require('https');
const axios = require('axios');
const gqlQuery = require('../data/gqlQuery.js');
const _ = require('lodash');

class SCConnector {
  constructor(scEndpoint, scApikey, isScHttpAgent) {
    this.endpoint = scEndpoint;
    this.apikey = scApikey;
    this.isScHttpAgent = isScHttpAgent;
  }

  createUrl(countryCode, languageCode) {
    let cc = countryCode.toLowerCase();
    cc = cc === 'uk' ? 'gb' : cc;
    const lc = languageCode.toLowerCase();
    return `${this.endpoint}?sc_apikey=${this.apikey}&sc_site=drx-${cc}-${lc}`;
  }

  async getRegionsResponse(countryCode, languageCode) {
    const url = this.createUrl('us', languageCode);
    const upperCountryCode = _.toUpper(countryCode);
    const query = gqlQuery.getRegionsQuery(_.toLower(countryCode));
    const path = `/sitecore/content/cds/Regions/${upperCountryCode}`;
    const language = _.toLower(languageCode);

    const variables = {
      path,
      language
    };

    const requestHeaders = {};

    const resp = await this.getGQLresponse(
      url,
      query,
      variables,
      requestHeaders
    );

    return resp;
  }

  async getGQLresponse(url, query, variables, requestHeaders) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...requestHeaders
      }
    };

    if (this.isScHttpAgent) {
      config.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });
    }

    const resp = await axios
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
        console.log((error && error.response) || error);
      });

    return resp;
  }
}

module.exports = SCConnector;
