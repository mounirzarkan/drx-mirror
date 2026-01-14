'use strict';
const {log} = require('../util/index.js');

class ResponseSimulation {
  constructor(appConfig) {
    this.errorUsers = appConfig.errorUsers || [];
  }

  matchingUser(cochlearId, apiName) {
    log.debug('ResponseSimulation, matchingUser: - errorUsers');
    log.debug(this.errorUsers.manuals[apiName]);

    return this.errorUsers.manuals[apiName].some(({cid}) => {
      return cid === cochlearId;
    });
  }

  simulate(cochlearId, apiName) {
    log.debug('ResponseSimulation, simulate: - cochlearId');
    log.debug(cochlearId);

    log.debug('ResponseSimulation, simulate: - apiName');
    log.debug(apiName);

    if (this.matchingUser(cochlearId, apiName)) {
      log.debug('ResponseSimulation, simulate error success');

      throw new Error('Simulated Error');
    }
    return undefined;
  }
}

module.exports = ResponseSimulation;
