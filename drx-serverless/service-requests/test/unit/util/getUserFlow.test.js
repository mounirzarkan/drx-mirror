const sinon = require('sinon');
const {expect} = require('chai');
const {getUserFlow, USER_FLOW} = require('../../../src/util/index.js');

describe.skip('SUITE: getUserFlow', () => {
  beforeEach(() => {});

  afterEach(() => {
    sinon.restore();
  });

  it('CASE: should return the correct user flow for Lambda Mock user', async () => {
    const config = {
      successUsers: {
        lambdaMock: {
          serviceRequests: [{cid: 'cochlearId1'}, {cid: 'cochlearId2'}]
        }
      }
    };

    const cochlearId = 'cochlearId1';
    const countryCode = 'US';

    const result = await getUserFlow(config, cochlearId, countryCode);

    expect(result).to.equal(USER_FLOW.LAMBDA_MOCK);
  });

  it('CASE: should return the correct user flow for SAGE user', async () => {
    const config = {
      successUsers: {
        sage: {
          serviceRequests: [{cid: 'cochlearId1'}, {cid: 'cochlearId2'}]
        }
      }
    };
    const cochlearId = 'cochlearId2';
    const countryCode = 'US';

    const result = await getUserFlow(config, cochlearId, countryCode);

    expect(result).to.equal(USER_FLOW.SAGE);
  });

  it('CASE: should return the default user flow for non-matching user', async () => {
    const config = {
      successUsers: {
        sf: {
          token: [{cid: 'cochlearId1'}, {cid: 'cochlearId2'}]
        }
      }
    };
    const cochlearId = 'cochlearId3';
    const countryCode = 'US';

    const result = await getUserFlow(config, cochlearId, countryCode);

    expect(result).to.equal(USER_FLOW.DEFAULT);
  });
});
