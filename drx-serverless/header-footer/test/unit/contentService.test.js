'use strict';
const sinon = require('sinon');
const ContentService = require('../../src/service/contentService');
const {expect} = require('chai');

describe('SUITE: ContentService.', () => {
  const config = {
    _scEndpoint: 'https://www2.cochlear.com/api/cochlear',
    _Environment: 'dev',
    _host: 'www.cochlear.com',
    _aws_secret: {
      sc_apikey: '',
      scp_env_username: '',
      scp_env_password: ''
    }
  };
  const usExpectedResponseStr = JSON.stringify(
    require('../mock/lambdaUSresponse.json')
  );
  let service = undefined;
  beforeEach(() => {
    service = new ContentService(config);
  });
  afterEach(() => {
    sinon.restore();
  });
  it('CASE: getHeaderFooter returns expected us headerfooter response.', async () => {
    sinon
      .stub(service.cmd, 'execute')
      .resolves(JSON.parse(usExpectedResponseStr));
    const result = await service.getHeaderFooter('en', 'us');
    expect(result).to.deep.equal(JSON.parse(usExpectedResponseStr));
  });

  it('CASE: getHeaderFooter on error returns HTTP400.', async () => {
    sinon.stub(service.cmd, 'execute').throws(new Error('400'));
    try {
      await service.getHeaderFooter('xx', 'us');
      expect(300).to.equal(400);
    } catch (error) {
      expect(error.statusCode).to.equal(400);
    }
  });
});
