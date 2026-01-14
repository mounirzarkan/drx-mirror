'use strict';

const {expect} = require('chai');
const ClinicsService = require('../../../src/service/clinicsService.js');

describe('SUITE: ClinicsService', () => {
  describe('SCENARIO: Search Clinics', () => {
    let clinicsService = null;
    before(function() {
      const config = {
        env: 'sit',
        sfClassicClinicFinderEndpoint:
          'https://cochlear--uat.sandbox.my.salesforce-sites.com/ClinicFinder/ClinicFinder'
      };
      clinicsService = new ClinicsService(config);
    });
    it('CASE : Search Clinics', async () => {
      const data = await clinicsService.searchClinics({
        ReqData:
          '{"productHash":"15","clinicHash":"3","count":30,"radius":500,"rk":2,"latValue":-33.81348601398805,"longValue":151.01681747458142}'
      });
      console.log(data);
      expect(data)
        .to.have.property('success')
        .equals(1);
    });
  });
});
