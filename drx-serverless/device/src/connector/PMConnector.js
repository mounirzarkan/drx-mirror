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

  async getDeviceList(cochlearId) {
    log.debug('PostmanMockConnector, getDeviceList: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getDeviceList: - cochlearId');
    log.debug(cochlearId);
    console.time('PM-getDeviceList');

    const resp = await this.connection.get(
      `/v1/patients/me/devices?id=${cochlearId}`
    );
    console.timeEnd('PM-getDeviceList');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }

  async getDevice(cochlearId, deviceId) {
    log.debug('PostmanMockConnector, getDevice: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getDevice: - cochlearId');
    log.debug(cochlearId);
    log.debug('PostmanMockConnector, getDevice: - deviceId');
    log.debug(deviceId);
    console.time('PM-getDevice');

    const resp = await this.connection.get(
      `/v1/patients/me/devices/single?id=${cochlearId}&deviceId=${deviceId}`
    );
    console.timeEnd('PM-getDevice');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }
}

module.exports = PMConnector;
