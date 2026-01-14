'use strict';
const services = require('../service/index.js');
const {log, utils, recaptchaVerifyUtil} = require('../util/index.js');
const _ = require('lodash');

class LossClaimsController {
  constructor(config) {
    this.cache = config.cache;
    this.recaptchaSecretKey = config.recaptchaSecretKey;
    this.userSessionSeconds = config.userSessionSeconds;
    const {LossClaimsService} = services;
    this.lossClaimsService = new LossClaimsService(config);
  }

  async submitLossClaim(formData) {
    log.debug('=====> lossClaimsController, submitLossClaim');

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
      '=====> lossClaimsController, submitLossClaim: reCaptchaToken = ' +
        formData.reCaptchaToken
    );
    log.debug(
      '=====> lossClaimsController, submitLossClaim: recaptchaSecretKey = ' +
        this.recaptchaSecretKey
    );
    const recaptchaValidation = await recaptchaVerifyUtil.verifyToken(
      formData.reCaptchaToken,
      this.recaptchaSecretKey
    );

    log.debug(
      '=====> lossClaimsController, submitLossClaim: recaptchaValidation = ' +
        recaptchaValidation
    );

    if (!recaptchaValidation) {
      log.debug('recaptcha verification failed');
      throw 'recaptcha verification failed';
    }

    log.debug('reCaptcha check successful!');

    const data = await this.lossClaimsService.submitLossClaim(formData);

    return data;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }
}

module.exports = LossClaimsController;
