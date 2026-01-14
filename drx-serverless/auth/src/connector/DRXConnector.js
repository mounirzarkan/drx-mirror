'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

class DRXConnector {
  constructor(params, accessToken) {
    log.debug('params,accessToken');
    log.debug(params);
    log.debug(accessToken);

    this.baseURL = params.drxBaseUrl;
    this.getAccountPath = params.drxGetAccountPath;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: this.baseURL,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }

  async getAccount(JWT_sub) {
    log.debug('in DRXConnector, getAccount: ');

    log.debug(this.getAccountPath);
    log.debug(JWT_sub);
    // console.time('SF-getAccount');
    const resp = await this.connection.get(
      `${this.getAccountPath}?id=${JWT_sub}`
    );
    // console.timeEnd('SF-getAccount');
    log.debug('getAccount response.data:');
    log.debug(resp.data);
    log.debug(resp.data.data);
    return resp.data.data;
  }
}

module.exports = DRXConnector;
