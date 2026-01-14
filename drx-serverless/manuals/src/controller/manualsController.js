'use strict';
const services = require('../service/index.js');
const {log, utils, recaptchaVerifyUtil} = require('../util/index.js');
const _ = require('lodash');

const MANUALS_CACHE_KEY_PREFIX = 'com-manuals-';
const FILE_VERSIONS_CACHE_KEY_PREFIX = 'com-manuals-versions-';
const FILE_LINKS_CACHE_KEY_PREFIX = 'com-manuals-links-';
const IS_CACHE_ENABLED = true;
class ManualsController {
  constructor(config) {
    this.cache = config.cache;
    this.recaptchaSecretKey = config.recaptchaSecretKey;
    this.userSessionSeconds = config.userSessionSeconds;
    const {ManualsService} = services;
    this.manualsService = new ManualsService(config);
  }

  async getIfus(params) {
    const searchInput = {
      countryCodes: params.country ? params.country.split(",") : undefined,
      languageCodes: params.language ? params.language.split(",") : undefined,
      productCodes: params.product ? params.product.split(",") : undefined,
      pageNumber: params?.page ?? 1,
      itemsPerPage: params?.['page-size'] ?? 20
    };

    log.debug('manualsController, getIfus: - searchInput');
    log.debug(searchInput);

    const ifuType = params?.ifuType ?? 'cochlear';

    let cacheKey = `all-${ifuType}`;
    log.debug('=====> manualsController, getIfus: cacheKey = ' + cacheKey);

    const allManualsStr = IS_CACHE_ENABLED
      ? await this.getFromCache(MANUALS_CACHE_KEY_PREFIX, cacheKey)
      : null;

    let allItems;
    if (!_.isEmpty(allManualsStr) && !_.isEmpty(JSON.parse(allManualsStr))) {
      log.debug('manualsController, getIfus: allManualsStr - Cache Hit');
      allItems = JSON.parse(allManualsStr);
    } else {
      log.debug('manualsController, getIfus: allManualsStr - Cache Miss');
      allItems = await this.manualsService.getAllItems({ifuType});

      await this.saveInCache(
        MANUALS_CACHE_KEY_PREFIX,
        cacheKey,
        allItems,
        this.userSessionSeconds
      );
    }

    // Filtered Items
    cacheKey = `filtered-${ifuType}-${Object.values(searchInput).join('-')}`;
    log.debug('=====> manualsController, getIfus: cacheKey = ' + cacheKey);

    const filteredManualsStr = IS_CACHE_ENABLED
      ? await this.getFromCache(MANUALS_CACHE_KEY_PREFIX, cacheKey)
      : null;

    let filteredItems;
    if (
      !_.isEmpty(filteredManualsStr) &&
      !_.isEmpty(JSON.parse(filteredManualsStr))
    ) {
      log.debug('manualsController, getIfus: filteredManualsStr - Cache Hit');
      filteredItems = JSON.parse(filteredManualsStr);
    } else {
      log.debug('manualsController, getIfus: filteredManualsStr - Cache Miss');
      filteredItems = await this.manualsService.getFilteredItems(
        allItems,
        searchInput
      );

      await this.saveInCache(
        MANUALS_CACHE_KEY_PREFIX,
        cacheKey,
        filteredItems,
        this.userSessionSeconds
      );
    }
    return filteredItems;
  }

  async getFileVersions(fileId) {
    log.debug('manualsController, getFileVersions: - fileId');
    log.debug(fileId);

    const fileVersionsStr = IS_CACHE_ENABLED
      ? await this.getFromCache(FILE_VERSIONS_CACHE_KEY_PREFIX, fileId)
      : null;

    if (
      !_.isEmpty(fileVersionsStr) &&
      !_.isEmpty(JSON.parse(fileVersionsStr))
    ) {
      log.debug('ManualsController, getFileVersions - : cached entry');
      log.debug(fileVersionsStr);
      return JSON.parse(fileVersionsStr);
    }
    log.debug('ManualsController, getFileVersions - : without cached entry');
    log.debug(fileVersionsStr);

    const data = await this.manualsService.getVersions(fileId);

    log.debug('manualsController, getFileVersions: - data');
    log.debug(data);

    await this.saveInCache(
      FILE_VERSIONS_CACHE_KEY_PREFIX,
      fileId,
      data,
      this.userSessionSeconds
    );

    return data;
  }

  async getIfuPublicLink(fileId) {
    log.debug('manualsController, getIfuPublicLink: - fileId');
    log.debug(fileId);

    let ifuPublicLinkStr = false
      ? await this.getFromCache(FILE_LINKS_CACHE_KEY_PREFIX, fileId)
      : null;

    if (
      !_.isEmpty(ifuPublicLinkStr) &&
      !_.isEmpty(JSON.parse(ifuPublicLinkStr))
    ) {
      return JSON.parse(ifuPublicLinkStr);
    }
    log.debug('ManualsController, getIfuPublicLink - : without cached entry');
    log.debug(ifuPublicLinkStr);

    const data = await this.manualsService.getItemPublicLink(fileId);

    log.debug('manualsController, getIfuPublicLink: - data');
    log.debug(data);

    await this.saveInCache(
      FILE_LINKS_CACHE_KEY_PREFIX,
      fileId,
      data,
      this.userSessionSeconds
    );

    return data;
  }

  async printIfus(formData) {
    log.debug('=====> manualsController, printIfus');

    log.debug('recaptcha required for SFHC request');
    // start recaptcha verification
    if (
      !formData.reCaptchaToken ||
      typeof formData.reCaptchaToken !== 'string'
    ) {
      log.debug('recaptcha token is undefined or incorrect type');
      throw 'recaptcha token is undefined or incorrect type';
    }

    log.debug(
      '=====> manualsController, printIfus: reCaptchaToken = ' +
        formData.reCaptchaToken
    );
    log.debug(
      '=====> manualsController, printIfus: recaptchaSecretKey = ' +
        this.recaptchaSecretKey
    );
    const recaptchaValidation = await recaptchaVerifyUtil.verifyToken(
      formData.reCaptchaToken,
      this.recaptchaSecretKey
    );

    log.debug(
      '=====> manualsController, printIfus: recaptchaValidation = ' +
        recaptchaValidation
    );

    if (!recaptchaValidation) {
      log.debug('recaptcha verification failed');
      throw 'recaptcha verification failed';
    }

    log.debug('reCaptcha check successful!');

    const data = await this.manualsService.printIfus(formData);

    return data;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }
}

module.exports = ManualsController;
