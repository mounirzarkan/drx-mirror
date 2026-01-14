const sinon = require('sinon');
const {expect} = require('chai');
const axios = require('axios');
const {getConfig, CONFIG_PROFILE} = require('../../../src/util/index.js');

const appConfigResponse = require('../../mock/appConfigResponse.json');

describe.skip('SUITE: getConfig', () => {
  let axiosGetStub;
  let url;
  let appConfigUrl;

  beforeEach(() => {
    url =
      'http://localhost:2772/applications/DRX_APP_CONFIG_SIT/environments/SIT/configurations';
    axiosGetStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('CASE: should retrieve and return the config data', async () => {
    const profile = CONFIG_PROFILE.EXPERIENCE_API;

    axiosGetStub.resolves({data: appConfigResponse});

    const result = await getConfig(profile, url);

    console.log('getConfig', result);

    sinon.assert.calledOnce(axiosGetStub);
    sinon.assert.calledWith(axiosGetStub, `${url || appConfigUrl}/${profile}`);

    expect(result).to.deep.equal(appConfigResponse);
  });

  it('CASE: should return an empty object if the request fails', async () => {
    const profile = CONFIG_PROFILE.SERVICE_REQUESTS;

    axiosGetStub.rejects(new Error('Simulated error'));

    const result = await getConfig(profile, url);

    sinon.assert.calledOnce(axiosGetStub);
    sinon.assert.calledWith(axiosGetStub, `${url || appConfigUrl}/${profile}`);

    expect(result).to.deep.equal({});
  });
});
