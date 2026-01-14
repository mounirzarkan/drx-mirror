const sinon = require('sinon');
const {expect} = require('chai');
const {ServiceRequestsController} = require('../../../src/controller/index.js');

const drxGetServiceRequestResponse = require('../../mock/drxGetServiceRequestResponse.json');
const drxGetServiceRequestsResponse = require('../../mock/drxGetServiceRequestsResponse.json');

describe('SUITE: ServiceRequestsController', () => {
  const configuration = {
    env: 'Environment',
    region: 'region',
    secretName: 'SMSFIntegration',
    pmEndpoint: 'PMEndpoint',
    boomiTokenEndpoint: 'boomiTokenEndpoint',
    boomiServiceEndpoint: 'boomiServiceEndpoint',
    sfHostname: 'SFHostname',
    sfClientId: 'SFClientID',
    sfUserName: 'SFUsername',
    scEndpoint: 'SCEndpoint',
    redisPort: 'RedisPort',
    redisHost: 'RedisHostname',
    redisTokenKey: 'redisTokenKey',
    userSessionPrefix: 'userSessionPrefix',
    tokenSessionSeconds: 12345,
    userSessionSeconds: 12345
  };

  let serviceRequestsController;

  beforeEach(() => {
    serviceRequestsController = new ServiceRequestsController(configuration);
  });

  it('CASE: should retrieve and convert service requests', async () => {
    const context = {
      sub: '198005035636309',
      obj: '198005035636309',
      page: 1
    };

    sinon.stub(serviceRequestsController, 'getFromCache').resolves(undefined);
    sinon
      .stub(
        serviceRequestsController.serviceRequestsService,
        'retrieveServiceRequests'
      )
      .resolves(drxGetServiceRequestsResponse);
    sinon.stub(serviceRequestsController, 'saveInCache').resolves(undefined);

    const resp =
      await serviceRequestsController.retrieveServiceRequests(context);

    expect(resp).to.deep.equal(drxGetServiceRequestsResponse);
  });

  it('CASE: should retrieve and convert a single service request', async () => {
    const context = {
      sub: '198005035636309',
      obj: '198005035636309',
      serviceRequestId: '380161'
    };

    sinon.stub(serviceRequestsController, 'getFromCache').resolves(undefined);
    sinon
      .stub(
        serviceRequestsController.serviceRequestsService,
        'retrieveServiceRequest'
      )
      .resolves(drxGetServiceRequestResponse);
    sinon.stub(serviceRequestsController, 'saveInCache').resolves(undefined);

    const resp =
      await serviceRequestsController.retrieveServiceRequest(context);

    expect(resp).to.deep.equal(drxGetServiceRequestResponse);
  });

  afterEach(() => {
    sinon.restore();
  });
});
