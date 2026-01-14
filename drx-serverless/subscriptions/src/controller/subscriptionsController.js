'use strict';
const services = require('../service/index.js');
const {log, utils, recaptchaVerifyUtil} = require('../util/index.js');
const _ = require('lodash');

class SubscriptionsController {
  constructor(config) {
    this.cache = config.cache;
    this.recaptchaSecretKey = config.recaptchaSecretKey;
    this.userSessionSeconds = config.userSessionSeconds;
    const {SubscriptionsService} = services;
    this.subscriptionsService = new SubscriptionsService(config);
  }

  async subscribeMicBatt(formData) {
    log.debug('=====> subscriptionsController, subscribeMicBatt');



    log.debug('recaptcha required for SFHC request');
    // start recaptcha verification
    if (
      !formData.reCaptchaToken ||
      typeof formData.reCaptchaToken !== 'string'
    ) {
      log.debug('recaptcha token is undefined or incorrect type');
      throw 'recaptcha token is undefined or incorrect type';
    }

    log.debug('=====> subscriptionsController, subscribeMicBatt: reCaptchaToken = ' + formData.reCaptchaToken);
    log.debug('=====> subscriptionsController, subscribeMicBatt: recaptchaSecretKey = ' + this.recaptchaSecretKey);
    const recaptchaValidation = await recaptchaVerifyUtil.verifyToken(
      formData.reCaptchaToken,
      this.recaptchaSecretKey
    );

    log.debug('=====> subscriptionsController, subscribeMicBatt: recaptchaValidation = ' + recaptchaValidation);

    if (!recaptchaValidation) {
      log.debug('recaptcha verification failed');
      throw 'recaptcha verification failed';
    }

    log.debug('reCaptcha check successful!');

    const data = await this.subscriptionsService.subscribeMicBatt(formData);

    return data;
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }
}

module.exports = SubscriptionsController;
