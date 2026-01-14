'use strict';
const services = require('../service/index.js');
const {log, utils, recaptchaVerifyUtil} = require('../util/index.js');
const _ = require('lodash');

class EnquiryController {
  constructor(config) {
    this.cache = config.cache;
    this.recaptchaSecretKey = config.recaptchaSecretKey;
    this.userSessionSeconds = config.userSessionSeconds;
    const {EnquiryService} = services;
    this.enquiryService = new EnquiryService(config);
  }

  async createEnquiryWebCase(formData) {
    log.debug('=====> EnquiryController, createEnquiryWebCase');

    // only require recaptcha for post-sage requests
    if (formData.isSFHC) {
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
        '=====> EnquiryController, createEnquiryWebCase: reCaptchaToken = ' +
          formData.reCaptchaToken
      );
      log.debug(
        '=====> EnquiryController, createEnquiryWebCase: recaptchaSecretKey = ' +
          this.recaptchaSecretKey
      );
      const recaptchaValidation = await recaptchaVerifyUtil.verifyToken(
        formData.reCaptchaToken,
        this.recaptchaSecretKey
      );

      log.debug(
        '=====> EnquiryController, createEnquiryWebCase: recaptchaValidation = ' +
          recaptchaValidation
      );

      if (!recaptchaValidation) {
        log.debug('recaptcha verification failed');
        throw 'recaptcha verification failed';
      }

      log.debug('reCaptcha check successful!');
    }

    const data = await this.enquiryService.createEnquiryWebCase(formData);

    return data;
  }
}

module.exports = EnquiryController;
