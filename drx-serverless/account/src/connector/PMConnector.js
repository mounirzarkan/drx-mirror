'use strict';

const axios = require('axios');
const {log} = require('../util/index');

class PMConnector {
  constructor(config) {
    this.instanceUrl = config.pm_endpoint;
    this.connection = axios.create({
      baseURL: this.instanceUrl
    });
  }

  async getUserInfo(cochlearId) {
    log.debug('PostmanMockConnector, getUserInfo: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getUserInfo: - cochlearId');
    log.debug(cochlearId);
    console.time('PM-getUserInfo');

    const resp = await this.connection.get(`/v1/patients/me?id=${cochlearId}`);
    console.timeEnd('PM-getUserInfo');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }
}

module.exports = PMConnector;
