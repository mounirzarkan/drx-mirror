'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

class PMConnector {
  constructor(config) {
    this.instanceUrl = config.pmEndpoint;
    this.connection = axios.create({
      baseURL: this.instanceUrl
    });
  }

  async getOrderHeaders(cochlearId) {
    log.debug('PostmanMockConnector, getOrderHeaders: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getOrderLines: - cochlearId');
    log.debug(cochlearId);
    console.time('PM-getOrderHeaders');

    const resp = await this.connection.get(
      `/v1/patients/me/orders?id=${cochlearId}`
    );
    console.timeEnd('PM-getOrderHeaders');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }

  async getOrderLines(cochlearId, headerId) {
    log.debug('PostmanMockConnector, getOrderLines: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getOrderLines: - cochlearId');
    log.debug(cochlearId);
    log.debug('PostmanMockConnector, getOrderLines: - deviceId');
    log.debug(headerId);
    console.time('PM-getOrderLines');

    const resp = await this.connection.get(
      `/v1/patients/me/orders/${headerId}/lines?id=${cochlearId}`
    );
    console.timeEnd('PM-getOrderLines');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }
}

module.exports = PMConnector;
