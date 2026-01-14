'use strict';
const services = require('../service/index.js');
const {log, utils, recaptchaVerifyUtil} = require('../util/index.js');
const _ = require('lodash');

const CLINICS_SEARCH_CACHE_KEY_PREFIX = 'com-clinics-search-';
const IS_CLINICS_SEARCH_CACHE_ENABLED = true;

class ClinicsController {
  constructor(config) {
    this.cache = config.cache;
    this.recaptchaSecretKey = config.recaptchaSecretKey;
    this.userSessionSeconds = config.userSessionSeconds;
    const {ClinicsService} = services;
    this.clinicsService = new ClinicsService(config);
  }

  async searchClinics(params) {
    log.debug('=====> ClinicsController, searchClinics');

    if (!params?.ReqData) throw 'ReqData is required';

    const connector = params.connector === 'sfhc' ? 'sfhc' : 'classic';

    const clinicMethod =
      connector === 'sfhc' ? 'searchClinicsSFHC' : 'searchClinics';

    const ReqData = JSON.parse(params.ReqData);
    log.debug(
      '=====> ClinicsController, ' + clinicMethod + ': ReqData = ' + ReqData
    );

    // Construct cache key
    const cacheKey =
      connector === 'sfhc'
        ? this.clinicsService.getCacheKeySFHC(ReqData)
        : this.clinicsService.getCacheKey(ReqData);

    log.debug(
      '=====> ClinicsController, ' + clinicMethod + ': cacheKey = ' + cacheKey
    );

    const clinicsStr = IS_CLINICS_SEARCH_CACHE_ENABLED
      ? await this.getFromCache(CLINICS_SEARCH_CACHE_KEY_PREFIX, cacheKey)
      : null;

    let clinics;
    if (!_.isEmpty(clinicsStr) && !_.isEmpty(JSON.parse(clinicsStr))) {
      log.debug(
        'ClinicsController, ' + clinicMethod + ': clinicsStr - Cache Hit'
      );
      clinics = JSON.parse(clinicsStr);
    } else {
      log.debug(
        'ClinicsController, ' + clinicMethod + ': clinicsStr - Cache Miss'
      );
      clinics = await this.clinicsService[clinicMethod](params);

      await this.saveInCache(
        CLINICS_SEARCH_CACHE_KEY_PREFIX,
        cacheKey,
        clinics,
        this.userSessionSeconds
      );
    }

    return clinics;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }
}

module.exports = ClinicsController;
