'use strict';

const SFConnector = require('../../src/connector/SFConnector.js');
const {expect} = require('chai');

describe.skip('SUITE: SFConnector', () => {
  it('CASE: updateLogin for ChangeUserName returns status 200 response.', async () => {
    const tokenObj = {
      instanceUrl: 'https://cochlear--uob2.my.salesforce.com',
      accessToken: ''
    };
    const payload = {
      request: {
        customerIdentifier: 162748173278165,
        type: 'ChangeUserName'
      }
    };
    const sfConnector = new SFConnector(tokenObj);
    const response = await sfConnector.updateLogin(payload);

    expect(response).with.property('status').equal(true);
  });

  it('CASE: updateLogin for ChangePassword returns status 200 response.', async () => {
    const tokenObj = {
      instanceUrl: 'https://cochlear--uob2.my.salesforce.com',
      accessToken: ''
    };
    const payload = {
      request: {
        customerIdentifier: 162748173278165,
        type: 'ChangePassword'
      }
    };
    const sfConnector = new SFConnector(tokenObj);
    const response = await sfConnector.updateLogin(payload);

    expect(response).with.property('status').equal(true);
  });
});
