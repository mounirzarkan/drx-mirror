'use strict';

const axios = require('axios');
const {log} = require('../util/index');

class SFConnector {
  constructor({instanceUrl, accessToken}) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: instanceUrl,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }

  async getIdentity(cochlear_id) {
    log.debug('in SFConnector, getIdentity: ');
    log.debug(cochlear_id);
    console.time('SF-getIdentity');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/identity/Cochlear_Identifier__c/${cochlear_id}`
    );

    console.timeEnd('SF-getIdentity');
    log.debug('getIdentity response.data:');
    log.debug(resp.data);
    return resp.data.data.items[0];
  }

  async getRelationship(cochlear_id) {
    log.debug('in SFConnector, getRelationship: ');
    log.debug(cochlear_id);
    console.time('SF-getRelationship');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/relationship/Customer_Identifier__c/${cochlear_id}`
    );
    console.timeEnd('SF-getRelationship');
    log.debug('getRelationship response.data:');
    log.debug(resp.data);
    return resp.data.data.items[0];
  }

  async getAccount(cochlear_id) {
    log.debug('in SFConnector, getAccount: ');
    log.debug(cochlear_id + this.accessToken);
    console.time('SF-getAccount');
    const resp = await this.connection.get(
      `/services/apexrest/Account?customerIdentifier=${cochlear_id}`
    );
    console.timeEnd('SF-getAccount');
    log.debug('getAccount response.data:');
    log.debug(resp.data);
    return resp.data.data;
  }

  async patchAccount(account) {
    log.debug('in SFConnector, patchAccount: ');
    log.debug(account);
    console.time('SF-patchAccount');
    const resp = await this.connection.patch(
      `/services/apexrest/Account`,
      account
    );
    console.timeEnd('SF-patchAccount');
    log.debug('patchAccount response.data:');
    log.debug(resp.data);
    return resp.data.data;
  }

  async getAccountV2(cochlear_id) {
    console.time('SF-getAccountV2');
    const resp = await this.connection.get(
      `/services/apexrest/v2/data/accounts/customer_identifier__c/${cochlear_id}`
    );
    console.timeEnd('SF-getAccount');
    return resp.data.data.accountData;
  }
}

module.exports = SFConnector;
