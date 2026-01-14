const sinon = require('sinon');
const {expect} = require('chai');
const {ServiceRequestsService} = require('../../../src/service/index.js');
const connectors = require('../../../src/connector/index.js');
const conversion = require('../../../src/conversion/index.js');

const boomiGetServiceRequestsResponse = require('../../mock/boomiGetServiceRequestsResponse.json');
const boomiGetServiceRequestResponse = require('../../mock/boomiGetServiceRequestResponse.json');
const drxGetServiceRequestResponse = require('../../mock/drxGetServiceRequestResponse.json');
const drxGetServiceRequestsResponse = require('../../mock/drxGetServiceRequestsResponse.json');

describe('SUITE: ServiceRequestsService', () => {
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

  let boomiConnectorStub;
  let boomiConverterStub;
  let serviceRequestsService;

  beforeEach(() => {
    boomiConnectorStub = sinon.stub(connectors, 'BOOMIConnector');
    boomiConverterStub = sinon.stub(
      conversion,
      'BOOMIServiceRequestsConversion'
    );
    serviceRequestsService = new ServiceRequestsService(configuration);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('CASE: should retrieve and convert service requests', async () => {
    const getServiceRequestsStub = sinon.stub();
    const convertServiceRequestsStub = sinon.stub();

    boomiConnectorStub.returns({
      getServiceRequests: getServiceRequestsStub.resolves(
        boomiGetServiceRequestsResponse
      )
    });

    boomiConverterStub.returns({
      convertServiceRequests: convertServiceRequestsStub.returns(
        drxGetServiceRequestsResponse
      )
    });

    const result = await serviceRequestsService.retrieveServiceRequests(
      '198005035636309',
      1
    );

    expect(result).to.have.property('requestList');
    expect(result).to.deep.equal(drxGetServiceRequestsResponse);
  });

  it('CASE: should retrieve and convert a single service request', async () => {
    const getServiceRequestStub = sinon.stub();
    const convertServiceRequestStub = sinon.stub();

    boomiConnectorStub.returns({
      getServiceRequest: getServiceRequestStub.resolves(
        boomiGetServiceRequestResponse
      )
    });

    boomiConverterStub.returns({
      convertServiceRequest: convertServiceRequestStub.returns(
        drxGetServiceRequestResponse
      )
    });

    const result = await serviceRequestsService.retrieveServiceRequest(
      '198005035636309',
      '380161'
    );

    expect(result).to.have.property('requestDetails');
    expect(result).to.have.property('shippingDetails');
    expect(result).to.deep.equal(drxGetServiceRequestResponse);
  });
});
