'use strict';

const axios = require('axios');
const {log} = require('../util/index.js');

class PMConnector {
  constructor(config) {
    this.instanceUrl = config.pmEndpoint;
    this.connection = axios.create({
      baseURL: this.instanceUrl
    });
  }

  async getAddress(cochlearId) {
    log.debug('PostmanMockConnector, getAddress: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getAddress: - cochlearId');
    log.debug(cochlearId);
    console.time('PM-getAddress');

    const resp = await this.connection.get(
      `/v1/patients/me/address?id=${cochlearId}`
    );
    console.timeEnd('PM-getAddress');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }
}

module.exports = PMConnector;
