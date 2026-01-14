'use strict';

const _ = require('lodash');
const CacheKeyService = require('./cacheKeyService.js');
const SCConnector = require('../connector/SCConnector.js');
const transformGQL = require('../transform/transformGQL.js');
const log = require('../util/logUtil.js');
const DEFAULT_COUNTRY_CODE = 'us';
const DEFAULT_LANGUAGE_CODE = 'en';

class ContentService {
  constructor(config) {
    this.config = config;
    this.cacheRepo = config.cacheRepo;
    this.cacheKeyService = new CacheKeyService(config);
    this.cacheSeconds = parseInt(config.userSessionSeconds);
    this.isScHttpAgent = config._isScHttpAgent;
    this.aws_secret = config._aws_secret;

    this.scConnector = new SCConnector(
      config.sc_endpoint,
      config.sf_secret,
      this.isScHttpAgent
    );
  }

  getHeaderList(authorizer) {
    const headerlist = {
      initial:
        _.toUpper(authorizer.firstName.charAt(0)) +
        _.toUpper(authorizer.lastName.charAt(0)),
      email: authorizer.email
    };

    log.debug('headerlist:');
    log.debug(headerlist);
    return headerlist;
  }

  transformResponse(resp, personas) {
    return transformGQL.transformConfigurationResponse(resp, personas);
  }

  async getResponseFromCache(uhMenuKey) {
    const cachedResp = await this.cacheRepo.get(uhMenuKey);

    log.debug('contentService.getUHmenu, cachedResp');
    log.debug(cachedResp);

    const response = cachedResp ? JSON.parse(cachedResp) : undefined;

    log.debug('contentService.getResponseFromCache, response');
    log.debug(response);

    return response;
  }

  async saveToCache(key, value, seconds) {
    const valueStr = JSON.stringify(value);
    await this.cacheRepo.save(key, valueStr, seconds);
    return valueStr;
  }

  async getUHmenu(headerlist, countryCode, languageCode, app) {
    const respHeaderlist = {...headerlist};

    const uhMenuKey = this.cacheKeyService.getUHmenuConfigkey(
      countryCode,
      languageCode
    );

    log.debug('contentService.getUHmenu, uhMenuKey');
    log.debug(uhMenuKey);

    let transformedResponse = await this.getResponseFromCache(uhMenuKey);

    log.debug('contentService.getUHmenu, transformedResponse');
    log.debug(transformedResponse);

    if (!transformedResponse) {
      const resp = await this.scConnector.getUHmenu(countryCode, languageCode);

      log.debug('contentService.getUHmenu, resp');
      log.debug(resp);

      if (resp && resp.item) {
        transformedResponse = this.transformResponse(resp); //transformGQL.transformConfigurationResponse(resp); //

        await this.saveToCache(
          uhMenuKey,
          transformedResponse,
          this.cacheSeconds
        );
      } else {
        if (_.toLower(countryCode) !== DEFAULT_COUNTRY_CODE) {
          // retry with DEFAULT_COUNTRY_CODE & DEFAULT_LANGUAGE_CODE
          return await this.getUHmenu(
            headerlist,
            DEFAULT_COUNTRY_CODE,
            DEFAULT_LANGUAGE_CODE
          );
        }
      }
    }

    log.debug('contentService.getUHmenu, transformedResponse');
    log.debug(transformedResponse);

    // convert GS response by removing '/us/en'
    if (app === 'gs') {
      log.debug('before contentService.getUHmenu, transformedResponse');
      log.debug(transformedResponse);
      log.debug('contentService.getUHmenu, transformedResponse.dropDownList');
      log.debug(transformedResponse.dropDownList);
      const dropDownList = transformedResponse.dropDownList.map((item) => {
        if (
          item &&
          item.icon === 'chevron' &&
          item.url.substring(3, 6) === `/${languageCode.toLowerCase()}`
        ) {
          return {...item, url: item.url.slice(6, item.url.length)};
        }
        return item;
      });
      transformedResponse = {...transformedResponse, dropDownList};
      log.debug('after contentService.getUHmenu, transformedResponse');
      log.debug(transformedResponse);
    }

    Object.assign(respHeaderlist, transformedResponse);

    log.debug('contentService.getUHmenu, respHeaderlist');
    log.debug(respHeaderlist);

    return respHeaderlist;
  }

  async getHeader(authorizer, countryCode, languageCode, app, personas) {
    let headerlist = {};
    const cochlear_id = authorizer.sub;
    const userType = authorizer.userType || 'Recipient';
    const userInfoKey = this.cacheKeyService.getUserInfoKey(
      this.config.userSessionPrefix,
      cochlear_id
    );
    log.debug('userInfoKey: ');
    log.debug(userInfoKey);

    let userInfo = undefined;
    if (this.cacheRepo) {
      userInfo = await this.cacheRepo.get(userInfoKey);
      log.debug('userInfo from cache ');
      log.debug(userInfo);
    } else {
      log.debug('ContentService - getHeader - without cache:');
    }

    if (userInfo) {
      headerlist = JSON.parse(userInfo);
    } else {
      headerlist = this.getHeaderList(authorizer);

      if (this.cacheRepo) {
        await this.cacheRepo.save(
          userInfoKey,
          JSON.stringify(headerlist),
          parseInt(this.config.userSessionSeconds)
        );
      }
    }

    log.debug('beforer get UHmenu, headerlist: ');
    log.debug(headerlist);

    headerlist = await this.getUHmenu(
      headerlist,
      countryCode,
      languageCode,
      app
    );

    log.debug('after get UHmenu, headerlist: ');
    log.debug(headerlist);

    if (personas.includes('pending')) {
      // Pending personas should see restricted menu
      headerlist.dropDownList = headerlist.dropDownListForPending;
      headerlist.whatsnew.content = headerlist.contentForPending;
      delete headerlist.dropDownListForPending;
      delete headerlist.contentForPending;
      return headerlist;
    }

    delete headerlist.dropDownListForPending;
    delete headerlist.contentForPending;

    if (userType !== 'Recipient' && userType !== 'Carer') {
      // Professional users should not be able to see dropdown items
      headerlist.dropDownList = [];
    }

    return headerlist;
  }
}
module.exports = ContentService;
