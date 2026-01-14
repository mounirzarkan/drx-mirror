'use strict';
const https = require('https');
const axios = require('axios');
const log = require('../util/logUtil.js');
const gqlQuery = require('../data/gqlQuery.js');
const {translationMapping} = require('../mappers/scMapper.js');
const _ = require('lodash');

class SCConnector {
  constructor(sc_endpoint, sf_secret, isScHttpAgent) {
    if (
      _.isEmpty(sf_secret.scp_env_username) ||
      _.isEmpty(sf_secret.scp_env_password)
    ) {
      this.headers = {};
    } else {
      // Has basic auth username and password, add it to header
      const authorization =
        'Basic ' +
        Buffer.from(
          sf_secret.scp_env_username + ':' + sf_secret.scp_env_password
        ).toString('base64');
      this.headers = {
        authorization
      };
    }

    this.endpoint = sc_endpoint;
    this.apikey = sf_secret.sc_apikey;
    this.req = axios.create({});
    this.isScHttpAgent = isScHttpAgent;
    this.aws_secret = sf_secret;

    log.debug('SCConnector constructor englishSpeakingCountries');
    log.debug(this.aws_secret.englishSpeakingCountries);

    log.debug('set secret');
    log.debug(this.aws_secret);
  }

  createUrl(countryCode, languageCode) {
    let cc = countryCode.toLowerCase();
    cc = cc === 'uk' ? 'gb' : cc;
    // eslint-disable-next-line no-unused-vars
    const lc = languageCode.toLowerCase();
    // TODO check to see why this is hardcoded!
    return `${this.endpoint}?sc_apikey=${this.apikey}&sc_site=drx-us-en`;
  }

  async getFooterResponse(countryCode, languageCode) {
    log.debug('SCConnector getFooterResponse, languageCode');
    log.debug(languageCode);

    const url = this.createUrl(countryCode, languageCode);

    log.debug('SCConnector getFooterResponse, url');
    log.debug(url);

    const upperCountryCode = _.toUpper(countryCode);

    log.debug('SCConnector getFooterResponse, upperCountryCode');
    log.debug(upperCountryCode);

    const query = gqlQuery.getFooterQuery();

    log.debug('SCConnector getFooterResponse, footer query');
    log.debug(query);

    const path = `/sitecore/content/drx/${upperCountryCode}/Configuration/Footer/DRX Footer`;

    log.debug('SCConnector getFooterResponse, path');
    log.debug(path);

    log.debug('SCConnector getFooterResponse englishSpeakingCountries');
    log.debug(this.aws_secret);
    log.debug(this.aws_secret.englishSpeakingCountries);

    const language = translationMapping(
      countryCode,
      languageCode,
      this.aws_secret.englishSpeakingCountries
    );

    const variables = {
      path,
      language
    };

    log.debug('SCConnector getFooterResponse, variables');
    log.debug(variables);

    const requestHeaders = {};

    const resp = await this.getGQLresponse(
      url,
      query,
      variables,
      requestHeaders
    );

    log.debug('SCConnector getFooterResponse, resp');
    log.debug(resp);

    return resp;
  }

  async getHeaderResponse(countryCode, languageCode) {
    log.debug('SCConnector getHeaderResponse, languageCode');
    log.debug(languageCode);

    const upperCountryCode = _.toUpper(countryCode);

    log.debug('SCConnector getHeaderResponse, upperCountryCode');
    log.debug(upperCountryCode);

    const url = this.createUrl(countryCode, languageCode);

    log.debug('SCConnector getHeaderResponse, url');
    log.debug(url);

    const headerQuery = gqlQuery.getHeaderQuery();
    const uhMenuQuery = gqlQuery.getUhMenuQuery();

    log.debug('SCConnector getHeaderResponse, header query');
    log.debug(headerQuery);

    log.debug('SCConnector getHeaderResponse, uhmenu query');
    log.debug(uhMenuQuery);

    const path = `/sitecore/content/drx/${upperCountryCode}/Configuration/Header/DRX Header`;

    log.debug('SCConnector getHeaderResponse, path');
    log.debug(path);

    const language = translationMapping(
      countryCode,
      languageCode,
      this.aws_secret.englishSpeakingCountries
    );

    const variables = {
      path,
      language
    };

    log.debug('SCConnector getHeaderResponse, variables');
    log.debug(variables);

    const requestHeaders = {};

    const queries = [headerQuery, uhMenuQuery];

    const responses = await Promise.all(
      queries.map((q) => this.getGQLresponse(url, q, variables, requestHeaders))
    );

    const mergedResponses = responses.reduce((accumulator, item) => {
      return Object.assign(item, accumulator);
    }, {});

    log.debug('SCConnector getHeaderResponse, mergedResponses');
    log.debug(mergedResponses);

    return mergedResponses;
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
        console.log((error && error.response) || error);
        log.debug('SCConnector getGQLresponse, error');
        log.debug((error && error.response) || error);
      });

    log.debug('SCConnector getGQLresponse, resp');
    log.debug(resp);

    return resp;
  }
}

module.exports = SCConnector;
