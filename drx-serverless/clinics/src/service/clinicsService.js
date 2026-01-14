'use strict';

const {log, utils} = require('../util/index.js');
const connectors = require('../connector/index.js');

class ClinicsService {
  constructor(config) {
    this.config = config;
  }

  async searchClinics(params) {
    log.debug('=====> ClinicsService, searchClinics');

    const {SFClassicClinicsConnector} = connectors;
    const sfClassicClinicsConnector = new SFClassicClinicsConnector(
      this.config
    );

    // No logic in this service for now, just pass the params to the connector
    const response = await sfClassicClinicsConnector.searchClinics(params);

    return response;
  }

  getCacheKey(reqData) {
    return (
      'product-' +
      reqData.productHash +
      '-clinic-' +
      reqData.clinicHash +
      '-count-' +
      reqData.count +
      '-radius-' +
      reqData.radius +
      '-rk-' +
      reqData.rk +
      '-lat-' +
      parseFloat(reqData.latValue).toFixed(4) + // parseFloat to use 4 decimal places
      '-lon-' +
      parseFloat(reqData.longValue).toFixed(4) + // parseFloat to use 4 decimal places
      '-connector-classic'
    );
  }

  async searchClinicsSFHC(params, boomiParams) {
    log.debug('=====> ClinicsService, searchClinicsSFHC');

    const {SFHCClinicsConnector} = connectors;
    const sfhcClinicsConnector = new SFHCClinicsConnector(this.config);

    // No logic in this service for now, just pass the params to the connector
    const response = await sfhcClinicsConnector.searchClinics(params);

    return response;
  }

  getCacheKeySFHC(reqData) {
    return (
      'product-' +
      reqData.productHash +
      '-clinic-' +
      reqData.clinicTypeHash +
      '-count-' +
      reqData.resultLimit +
      '-radius-' +
      reqData.radius +
      '-lat-' +
      parseFloat(reqData.latValue).toFixed(4) + // parseFloat to use 4 decimal places
      '-lon-' +
      parseFloat(reqData.longValue).toFixed(4) + // parseFloat to use 4 decimal places
      '-connector-sfhc'
    );
  }
}

module.exports = ClinicsService;
