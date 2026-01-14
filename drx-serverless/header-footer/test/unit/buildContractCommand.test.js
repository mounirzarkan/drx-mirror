'use strict';
const sinon = require('sinon');
const {expect} = require('chai');

const BuildContractCommand = require('../../src/commands/buildContractCommand.js');

describe('SUITE: BuildContractCommand.', () => {
  const headerGQLresponseStr = JSON.stringify(
    require('../mock/headerGQLresponse.json')
  );
  const footerGQLresponseStr = JSON.stringify(
    require('../mock/footerGQLresponse.json')
  );
  const usExpectedResponseStr = JSON.stringify(
    require('../mock/lambdaUSresponse.json')
  );
  let command = undefined;
  beforeEach(() => {
    const config = {
      _Environment: 'dev',
      _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
      _aws_secret: {
        sc_apikey: '',
        scp_env_username: '',
        scp_env_password: ''
      }
    };
    command = new BuildContractCommand(config);
  });
  afterEach(() => {
    sinon.restore();
  });
  it('CASE: command.execute returns expected US header footer response', async () => {
    sinon
      .stub(command.scConnector, 'getHeaderResponse')
      .resolves(JSON.parse(headerGQLresponseStr));
    sinon
      .stub(command.scConnector, 'getFooterResponse')
      .resolves(JSON.parse(footerGQLresponseStr));
    const uc = await command.execute('en', 'us');
    expect(uc).to.deep.equal(JSON.parse(usExpectedResponseStr));
  });
});
