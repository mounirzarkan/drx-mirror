'use strict';

const {expect} = require('chai');
const WebToCaseCommand = require('../../../src/commands/webToCaseCommand.js');

describe('SUITE: WebToCaseCommand', () => {
  describe('SCENARIO: Execute', () => {
    let webToCaseCommand = null;
    before(function() {
      const config = {
        env: 'sit',
        sfhcWebToCaseEndpoint:
          'https://mycochlear--uat.sandbox.my.salesforce.com/servlet/servlet.WebToCase'
      };
      webToCaseCommand = new WebToCaseCommand(config);
    });
    it('CASE : Enquiry Request', async () => {
      const data = await webToCaseCommand.execute({
        isSFHC: true,
        firstName: 'CochlearTestUnit',
        lastName: 'CochlearTest',
        subject: 'Device or app support',
        email: 'CochlearTestUnit@cochlear.com',
        phone: '+3571341235125',
        country: 'AU',
        description: 'CochlearTest WebToCaseCommand Unit Description'
      });
      console.log(data);
      expect(data.includes('Your request has been queued')).equals(true);
    });
    it('CASE : Contact Us Upgrade', async () => {
      const data = await webToCaseCommand.execute({
        isSFHC: true,
        firstName: 'CochlearTestContactUsUpgradeUnit',
        lastName: 'CochlearTest',
        subject: 'Device or app support',
        email: 'CochlearTestContactUsUpgradeUnit@cochlear.com',
        phone: '+23452355456',
        country: 'AU',
        description: 'CochlearTestContactUsUpgradeUnit WebToCaseCommand Unit Description',
        utmCampaign: 'campaign',
        utmContent: 'content',
        utmCreativeFormat: 'creative_format',
        utmId: 'id',
        utmMarketingTactic: 'marketing_tactic',
        utmMedium: 'medium',
        utmSource: 'source',
        utmSourcePlatform: 'source_platform',
        utmTerm: 'term',
        googleAnalyticsClientId: null,
        facebookId: '',
        webformUrl: 'http://localhost:3000/'
      });
      console.log(data);
      expect(data.includes('Your request has been queued')).equals(true);
    });
    it('CASE : IFU Docupack Request', async () => {
      const data = await webToCaseCommand.execute({
        isSFHC: true,
        firstName: 'CochlearTestUnit',
        lastName: 'CochlearTest',
        subject: 'IFU Docupack Request',
        reason: 'Something else',
        email: 'CochlearTestUnit@cochlear.com',
        phone: '+3571341235125',
        country: 'AU',
        description:
          'Description: Print Request\n \nPersonal Details:\nName: CochlearTestUnit CochlearTest\nEmail: CochlearTestUnit@cochlear.com\nPhone: +3571341235125\n \nAddress:\n1 University Avenue\nMacquarie University\nNSW\n2109\nAustralia\n \nFiles:\nP1971840\nP1234567\nP8881234\n'
      });
      console.log(data);
      expect(data.includes('Your request has been queued')).equals(true);
    });
  });
});
