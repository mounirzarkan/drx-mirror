'use strict';

const axios = require('axios');
const {log} = require('../util/index.js');

class SFConnector {
  constructor({instanceUrl, accessToken}) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: instanceUrl,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }

  async getAddress(cochlear_id) {
    log.debug('in SFConnector, getAddress: ');
    log.debug(cochlear_id);
    console.time('SF-getAddress');

    const resp = await this.connection.get(
      `/services/apexrest/v2/data/address?customerIdentifier=${cochlear_id}&currentResidence=true`
    );
    console.timeEnd('SF-getAddress');
    log.debug('response.data:');
    log.debug(resp.data);
    log.debug('items0:');
    log.debug(resp.data.data.items[0]);
    return resp.data.data;
  }

  async postAddress(address) {
    log.debug('in SFConnector, postAddress: ');
    log.debug(address);
    console.time('SF-postAddress');

    const resp = await this.connection.post(
      `/services/apexrest/v2/data/address`,
      address
    );
    console.timeEnd('SF-postAddress');
    log.debug('response:');
    log.debug(resp);
    return resp;
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
}

module.exports = SFConnector;
