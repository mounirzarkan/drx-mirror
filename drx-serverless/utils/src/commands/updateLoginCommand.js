'use strict';

const {SFConnector} = require('../connector/index.js');
const {SFIntegrationToken} = require('../token/index.js');
const {log} = require('../common/utils/index.js');

// For Security + Privacy (update login email or password)
class UpdateLoginCommand {
  constructor(config) {
    this.sfIntegrationToken = new SFIntegrationToken(config);
  }

  async execute(payload) {
    try {
      const token = await this.sfIntegrationToken.getCacheToken();

      const sfConnector = new SFConnector(token);

      const data = await sfConnector.updateLogin({
        request: payload
      });

      const resp = {success: data.success ? true : false};

      return resp;
    } catch (e) {
      log.debug(e);
      throw 'Error updating login';
    }
  }
}

module.exports = UpdateLoginCommand;
