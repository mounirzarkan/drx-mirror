'use strict';

const axios = require('axios');
const log = require('../util/logUtil.js');

class SFConnector {
  constructor({instanceUrl, accessToken}) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: instanceUrl,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }

  async getDeviceList(cochlearId) {
    console.time('SF-getDevices');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/accounts/customer_identifier__c/${cochlearId}/devices`
    );
    console.time('SF-getDevices');

    log.debug('resp.data');
    log.debug(resp.data);
    return resp.data;
  }

  async getDevice(cochlearId) {
    console.time('SF-getDevices');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/accounts/customer_identifier__c/${cochlearId}/devices`
    );
    console.time('SF-getDevices');

    log.debug('resp.data');
    log.debug(resp.data);
    return resp.data;
  }

  async getAccount(cochlearId) {
    console.time('SF-getAccount');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/accounts/customer_identifier__c/${cochlearId}`
    );
    console.time('SF-getAccount');

    log.debug('resp.data.data.accountData');
    log.debug(resp.data.data.accountData);
    return resp.data.data.accountData;
  }
}

module.exports = SFConnector;
