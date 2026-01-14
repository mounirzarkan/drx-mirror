'use strict';

const SFConnector = require('../../src/connector/SFConnector.js');
const {expect} = require('chai');

describe.skip('SUITE: SFConnector', () => {
  it('CASE: postAddress returns status 200 response.', async () => {
    const tokenObj = {
      instanceUrl: 'https://cochlear--uob2.my.salesforce.com',
      accessToken: ''
    };
    const addressObj = {
      request: {
        modifiedByApp: 'drx',
        modifiedBy: 'Amanda Ward',
        address: {
          customerIdentifier: '162748173278165',
          addressId: 'a0H7Y000005gw2VUAQ',
          street1: '33 Dabbs Cir',
          street2: '',
          street3: '',
          street4: '',
          city: 'Jacksons Gap',
          state: 'AL',
          postalCode: '36861-3719',
          countryIso2Code: 'US',
          isCurrentResidence: true
        }
      }
    };
    const sfConnector = new SFConnector(tokenObj);
    const response = await sfConnector.postAddress(addressObj);
    expect(response).with.property('status').equal(200);
  });
});
