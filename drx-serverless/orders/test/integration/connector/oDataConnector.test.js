'use strict';

const {expect} = require('chai');
const ODataConnector = require('../../../src/connector/oDataConnector.js');

describe.skip('SUITE: OdataConnector', () => {
  it('CASE: getOrderHeaders returns an array with at least one item.', async () => {
    const od_endpoint = 'http://odata4.dev.cochlear.cloud/odata4/odata4.svc';
    const secret = {
      od_env_username: '',
      od_env_password: ''
    };
    const oDataConnector = new ODataConnector(od_endpoint, secret);
    const result = await oDataConnector.getOrderHeaders(1225024);
    console.log('result', result.length);
    expect(result).to.be.a('array');
    expect(result).with.property('length').to.be.greaterThan(0);
  });

  it('CASE: getOrderLines returns an array with at least one item.', async () => {
    const od_endpoint = 'http://odata4.dev.cochlear.cloud/odata4/odata4.svc';
    const secret = {
      od_env_username: '',
      od_env_password: ''
    };
    const oDataConnector = new ODataConnector(od_endpoint, secret);
    const result = await oDataConnector.getOrderLines(29713350);
    console.log('result', result.length);
    expect(result).to.be.a('array');
    expect(result.length).to.be.greaterThan(0);
  });
});
