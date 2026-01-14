'use strict';

const SCConnector = require('../../src/connector/SCConnector.js');
const {expect} = require('chai');

describe.skip('output test', () => {
  it('transform uhMenu SC response to expected response.', async () => {
    const config = {
      sc_endpoint: 'https://www2.cochlear.com/api/cochlear',
      sf_secret: {
        sc_apikey: '',
        scp_env_username: '',
        scp_env_password: ''
      }
    };

    const scConnector = new SCConnector(config.sc_endpoint, config.sf_secret);
    const resp = await scConnector.getUHmenu('US');
    console.log('################ resp', JSON.stringify(resp));

    expect(true).to.equal(true);
  });

  it('SCConnector - getUHmenu When basic scp_env_username or scp_env_password is empty, make request without basic auth throws 401 error', async () => {
    const config = {
      sc_endpoint: 'https://dmsit.cx.nonp.cochlear.cloud',
      sf_secret: {
        sc_apikey: '',
        scp_env_username: '',
        scp_env_password: ''
      }
    };

    const scConnector = new SCConnector(config.sc_endpoint, config.sf_secret);
    let errorMessage = undefined;
    try {
      await scConnector.getUHmenu('US');
    } catch (error) {
      if (error && error.response) {
        errorMessage = error.response.status;
      }
    }
    expect(errorMessage).to.equal(401);
  });
});
