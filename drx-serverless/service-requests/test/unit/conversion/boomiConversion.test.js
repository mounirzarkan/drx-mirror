const sinon = require('sinon');
const {expect} = require('chai');
const conversion = require('../../../src/conversion');

const boomiGetServiceRequestsResponse = require('../../mock/boomiGetServiceRequestsResponse.json');
const boomiGetServiceRequestResponse = require('../../mock/boomiGetServiceRequestResponse.json');
const drxGetServiceRequestResponse = require('../../mock/drxGetServiceRequestResponse.json');
const drxGetServiceRequestsResponse = require('../../mock/drxGetServiceRequestsResponse.json');

describe('SUITE: BOOMIConversion', () => {
  let boomiConverter;

  beforeEach(() => {
    const {BOOMIServiceRequestsConversion} = conversion;
    boomiConverter = new BOOMIServiceRequestsConversion();
  });

  it('CASE: boomiConverter for service requests', () => {
    const resp = boomiConverter.convertServiceRequests(
      boomiGetServiceRequestsResponse
    );
    expect(resp).to.deep.equal(drxGetServiceRequestsResponse);
  });

  it('CASE: boomiConverter for single service request', () => {
    const resp = boomiConverter.convertServiceRequest(
      boomiGetServiceRequestResponse
    );

    expect(resp).to.deep.equal(drxGetServiceRequestResponse);
  });

  afterEach(() => {
    sinon.restore();
  });
});
