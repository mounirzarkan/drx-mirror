'use strict';

const {expect} = require('chai');
const EnquiryService = require('../../../src/service/enquiryService.js');

describe('SUITE: EnquiryService', () => {
  describe('SCENARIO: Create Enquiry WebCase', () => {
    let enquiryService = null;
    before(function() {
      const config = {
        env: 'sit'
      };
      enquiryService = new EnquiryService(config);
    });
    it('CASE : Enquiry Request', async () => {
      const data = await enquiryService.createEnquiryWebCase({
        firstName: 'CochlearTestUnit',
        lastName: 'CochlearTest',
        firstNameLocal: 'CochlearTestUnitFL',
        lastNameLocal: 'CochlearTestLL',
        subject: 'Device or app support',
        email: 'CochlearTestUnit@cochlear.com',
        phone: '+3571341235125',
        country: 'AU',
        description: 'CochlearTest EnquiryService Unit Description'
      });
      console.log(data);
      expect(data.includes('Your request has been queued')).equals(true);
    });
  });
});
