'use strict';
const services = require('../service/index.js');

const {isEmpty} = require('lodash');
const {log} = require('../util/index.js');
const CACHE_SR_KEY_PREFIX = 'serviceRequests-getServiceRequests-';
const CACHE_SR_SINGLE_KEY_PREFIX = 'serviceRequests-getServiceRequest-';
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';

class ServiceRequestsController {
  constructor(config) {
    this.encryptKey = config.encryptKey;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.userSessionSeconds = config.userSessionSeconds;
    const {ServiceRequestsService} = services;
    this.serviceRequestsService = new ServiceRequestsService(config);
  }

  async getFromCache(prefix, key) {
    return await this.cache.getCustomKeyCache(prefix, key);
  }

  async saveInCache(prefix, key, value, seconds) {
    await this.cache.saveCustomKeyInCache(prefix, key, value, seconds);
  }

  async retrieveServiceRequests({obj, sub, page}) {
    const serviceRequestsStr = await this.getFromCache(
      this.userSessionPrefix,
      CACHE_SR_KEY_PREFIX + sub + '-' + obj + ':' + page
    );

    log.debug(
      'serviceRequestsController, retrieveServiceRequests serviceRequestsStr:'
    );
    log.debug(serviceRequestsStr);

    if (
      !isEmpty(serviceRequestsStr) &&
      !isEmpty(JSON.parse(serviceRequestsStr))
    ) {
      return JSON.parse(serviceRequestsStr);
    }

    const accessToken = await this.getFromCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + sub
    );

    log.debug('serviceRequestsController, user accessToken:');
    log.debug(accessToken);

    const serviceRequests =
      await this.serviceRequestsService.retrieveServiceRequests(
        obj,
        page,
        accessToken
      );

    log.debug(
      'serviceRequestsController, retrieveServiceRequests: - serviceRequests'
    );
    log.debug(serviceRequests);

    await this.saveInCache(
      this.userSessionPrefix,
      CACHE_SR_KEY_PREFIX + sub + '-' + obj + ':' + page,
      serviceRequests,
      this.userSessionSeconds
    );
    return serviceRequests;
  }

  async retrieveServiceRequest({obj, sub, serviceRequestId}) {
    const serviceRequestStr = await this.getFromCache(
      this.userSessionPrefix,
      CACHE_SR_SINGLE_KEY_PREFIX + sub + '-' + obj + ':' + serviceRequestId
    );

    log.debug(
      'serviceRequestsController, retrieveServiceRequests serviceRequestsStr:'
    );
    log.debug(serviceRequestStr);

    if (
      !isEmpty(serviceRequestStr) &&
      !isEmpty(JSON.parse(serviceRequestStr))
    ) {
      return JSON.parse(serviceRequestStr);
    }

    const accessToken = await this.getFromCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + sub
    );

    log.debug('serviceRequestsController, user accessToken:');
    log.debug(accessToken);

    const serviceRequest =
      await this.serviceRequestsService.retrieveServiceRequest(
        obj,
        serviceRequestId,
        accessToken
      );

    log.debug(
      'serviceRequestsController, retrieveServiceRequest: - serviceRequest'
    );
    log.debug(serviceRequest);

    await this.saveInCache(
      this.userSessionPrefix,
      CACHE_SR_SINGLE_KEY_PREFIX + sub + '-' + obj + ':' + serviceRequestId,
      serviceRequest,
      this.userSessionSeconds
    );
    return serviceRequest;
  }

  async raiseServiceRequest(payload, context) {
    log.debug('ServiceRequestsController, raiseServiceRequest: - payload');
    log.debug(payload);

    log.debug('ServiceRequestsController, raiseServiceRequest: - context');
    log.debug(context);

    const accessToken = await this.getFromCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + context.sub
    );

    log.debug('serviceRequestsController, user accessToken:');
    log.debug(accessToken);

    return await this.serviceRequestsService.raiseServiceRequest(
      payload,
      context.obj,
      accessToken
    );
  }
}

module.exports = ServiceRequestsController;
