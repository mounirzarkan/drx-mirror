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

    log.debug('set secret');
    log.debug(this.aws_secret);
  }

  async getUHmenu(countryCode, languageCode) {
    const upperCountryCode = _.toUpper(countryCode);

    log.debug('SCConnector getUHmenu, upperCountryCode');
    log.debug(upperCountryCode);

    const url = this.createUrl(countryCode, languageCode);

    log.debug('SCConnector getHeaderResponse, url');
    log.debug(url);

    const query = gqlQuery.getUHmenuQuery();

    log.debug('SCConnector getUHmenu, query');
    log.debug(query);

    const path = `/sitecore/content/drx/${upperCountryCode}/Configuration/Header/DRX Header`;

    log.debug('SCConnector getUHmenu, path');
    log.debug(path);

    const language = translationMapping(
      countryCode,
      languageCode,
      this.aws_secret.englishSpeakingCountries.split(',')
    );

    const variables = {
      path,
      language
    };

    log.debug('SCConnector getUHmenu, variables');
    log.debug(variables);

    const requestHeaders = {};

    const data = await this.getGQLresponse(
      url,
      query,
      variables,
      requestHeaders
    );

    log.debug('SCConnector getUHmenu, data');
    log.debug(data);

    const links = data.item.dropDownList.links.map((link) => {
      if (!link.link.text) {
        link.link.text = link.name;
      }
      return link;
    });

    log.debug('SCConnector getUHmenu, links');
    log.debug(links);

    const resp = data;
    resp.item.dropDownList.links = links;

    log.debug('SCConnector getUHmenu, resp');
    log.debug(resp);

    return resp;
  }

  createUrl(countryCode, languageCode) {
    let cc = countryCode.toLowerCase();
    cc = cc === 'uk' ? 'gb' : cc;
    // eslint-disable-next-line no-unused-vars
    const lc =
      languageCode && languageCode.toLowerCase
        ? languageCode.toLowerCase()
        : 'en';
    // return `${this.endpoint}?sc_apikey=${this.apikey}&sc_site=drx-us-en`;
    // TODO - Daniel Cunha
    // TODO - The issue is caused by invalid certificates when the param &sc_site=drx-us-en is used
    // TODO - dynamically generate sc_site variable once fixed?
    return `${this.endpoint}?sc_apikey=${this.apikey}&sc_site=drx-us-en`;
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
