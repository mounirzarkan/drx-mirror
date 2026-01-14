'use strict';

const {SFConnector} = require('../connector/index.js');
const {SFIntegrationToken} = require('../token/index.js');
const {log} = require('../common/utils/index.js');

// For Service Requests initiated from support.com
class SendMailCommand {
  constructor(config) {
    this.sfIntegrationToken = new SFIntegrationToken(config);
  }

  async execute(payload) {
    try {
      const token = await this.sfIntegrationToken.getCacheToken();

      const sfConnector = new SFConnector(token);

      const data = await sfConnector.sendMail({
        request: payload
      });

      const resp = {result: data.success ? 'success' : 'error'};

      return resp;
    } catch (e) {
      log.debug(e);
      throw 'Error sending mail';
    }
  }
}

module.exports = SendMailCommand;
