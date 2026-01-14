'use strict';

const {expect} = require('chai');
const SubscriptionsService = require('../../../src/service/subscriptionsService.js');

describe('SUITE: SubscriptionsService', () => {
  describe('SCENARIO: Create Subscriptions WebCase', () => {
    let subscriptionsService = null;
    before(function() {
      const config = {
        env: 'sit'
      };
      subscriptionsService = new SubscriptionsService(config);
    });
    it('CASE : Subscriptions Request', async () => {
      const data = await subscriptionsService.subscribeMicBatt({
        firstName: 'CochlearTestSubscriptionsUnit',
        lastName: 'CochlearTest',
        subject: 'Device or app support',
        email: 'CochlearTestSubscriptionsUnit@cochlear.com',
        dateOfBirth: '1990-09-09',
        desiredService: 'Batteries - delivered quarterly',
        streetHouseNumber: 'Röntgenstr. 9',
        city: 'Maxdorf',
        postcode: '67133',
        country: 'DE',
        whichEar: 'Both sides',
        soundProcessorModelLeftSide: 'Nucleus 8 Sound Processor',
        soundProcessorColorLeftSide_2: 'Black',
        soundProcessorModelRightSide: 'Nucleus 7 Sound Processor',
        soundProcessorColorRightSide_2: 'White',
        healthInsuranceNameRegisteredOffice: 'AOK Rhe',
        healthInsuranceNumber: '123456789',
        HealthCloudGA__SourceSystem__c: 'BC/MC Webform'
      });
      console.log(data);
      expect(data.includes('Your request has been queued')).equals(true);
    });
  });
});
