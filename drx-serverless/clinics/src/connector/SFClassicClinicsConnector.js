const axios = require('axios');
const {log} = require('../util/index.js');

class SFClassicClinicsConnector {
  constructor(params) {
    this.sfClassicClinicFinderEndpoint = params.sfClassicClinicFinderEndpoint;
    console.log(
      '=====> SFClassicClinicsConnector: sfClassicClinicFinderEndpoint = ' +
        params.sfClassicClinicFinderEndpoint
    );
  }

async searchClinics(reqParams) {
    log.debug('=====> SFClassicClinicsConnector, searchClinics - reqParams:');
    log.debug(reqParams);

    const endpointUrl = `${this.sfClassicClinicFinderEndpoint}?ReqData=${reqParams.ReqData}`;

    const resp = await axios.get(endpointUrl);

    log.debug('=====> SFClassicClinicsConnector, searchClinics - resp.data:');
    log.debug(resp.data);
    return resp.data;
  }

}

module.exports = SFClassicClinicsConnector;
