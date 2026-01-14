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

  async getServiceRequests(cochlearId) {
    log.debug('PostmanMockConnector, getServiceRequests: - mockServer');
    log.debug(this.instanceUrl);
    log.debug('PostmanMockConnector, getServiceRequests: - cochlearId');
    log.debug(cochlearId);
    console.time('PM-getServiceRequests');

    const resp = await this.connection.get(
      `/v1/patients/me/service-requests?id=${cochlearId}`
    );
    console.timeEnd('PM-getServiceRequests');
    log.debug('response.data');
    log.debug(resp.data);

    return resp.data;
  }
}

module.exports = PMConnector;
