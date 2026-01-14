'use strict';

const axios = require('axios');
const {log} = require('../common/utils/index.js');

class SFConnector {
  constructor({instanceUrl, accessToken}) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
    this.connection = axios.create({
      baseURL: instanceUrl,
      headers: {Authorization: `Bearer ${this.accessToken}`}
    });
  }

  /*  
    sendMail: used in DRX Support to give send feedback via email
      Example payload:
        {
          country: "US",
          "email": "null",
          "firstName": "drxfeedback",
          "inquireyReason": "1",
          "lastName": "null",
          "comment": ""
        } 
  */
  async sendMail(payload) {
    try {
      log.debug('in SFConnector, sendMail - payload: ');
      log.debug(payload);

      console.time('SF-sendMail');
      const resp = await this.connection.post(
        `/services/apexrest/webToEmail`,
        payload
      );
      console.time('SF-sendMail');

      log.debug('resp.data');
      log.debug(resp.data);
      return resp.data;
    } catch (e) {
      console.error(e.response.data);
      throw new Error(e);
    }
  }

  /* updateLogin - used in DRX Main Security & Privacy page to update login or password
    Example payload:
      {
        type: "ChangePassword" || "ChangeUserName",
        customerIdentifier: "12321342345345"
      } 
  */
  async updateLogin(payload) {
    try {
      log.debug('in SFConnector, updateLogin - payload: ');
      log.debug(payload);

      console.time('SF-updateLogin');
      const resp = await this.connection.post(
        `/services/apexrest/v2/data/sendEmail`,
        payload
      );
      console.time('SF-updateLogin');

      log.debug('resp.data');
      log.debug(resp.data);
      return resp.data;
    } catch (e) {
      console.error(e.response.data);
      throw new Error(e);
    }
  }

  async getCochlearId(userId) {
    try {
      log.debug('in SFConnector, getCochlearId - userId: ');
      log.debug(userId);

      console.time('SF-getCochlearId');
      const resp = await this.connection.get(
        `/services/data/v58.0/sobjects/User/${userId}?fields=Id,Cochlear_Identifier__c`
      );
      console.time('SF-getCochlearId');

      log.debug('resp.data');
      log.debug(resp.data);
      return resp.data;
    } catch (e) {
      console.error(e.response.data);
      throw new Error(e);
    }
  }
}

module.exports = SFConnector;
