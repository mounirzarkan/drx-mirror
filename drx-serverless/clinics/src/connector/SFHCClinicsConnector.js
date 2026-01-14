const {log} = require('../util/index.js');
const BOOMIConnector = require('./BOOMIConnector.js');

class SFHCClinicsConnector {
  // params is instanceof EnvironmentConfiguration
  constructor(params) {
    this.boomiConnector = new BOOMIConnector(params);
  }

  async searchClinics(reqParams) {
    log.debug('=====> SFHCClinicsConnector, searchClinics - reqParams:');
    log.debug(reqParams);

    const resp = await this.boomiConnector.searchClinics(reqParams);

    log.debug('=====> SFHCClinicsConnector, searchClinics - resp:');
    log.debug(resp);

    return resp;
  }
}

module.exports = SFHCClinicsConnector;
