'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const GetAccessTokenCommand = require('../../../src/commands/getAccessTokenCommand.js');

describe('SUITE: GetAccessTokenCommand', () => {
  let getAccessTokenCommand;
  let cacheStub;

  beforeEach(() => {
    cacheStub = {
      getCustomKeyCache: sinon.stub()
    };

    getAccessTokenCommand = new GetAccessTokenCommand({
      cache: cacheStub,
      userSessionPrefix: 'testPrefix'
    });
  });

  it('CASE: should get access token from cache', async () => {
    const cochlearId = 'testId';
    const expectedToken = 'testToken';
    cacheStub.getCustomKeyCache.resolves(expectedToken);

    const result = await getAccessTokenCommand.execute(cochlearId);

    expect(result).to.equal(expectedToken);
    sinon.assert.calledWith(
      cacheStub.getCustomKeyCache,
      'testPrefix',
      'drxAccessTokenPrefix_' + cochlearId
    );
  });

  it('CASE: should throw error when getting access token fails', async () => {
    const cochlearId = 'testId';
    cacheStub.getCustomKeyCache.rejects(new Error('Cache error'));

    try {
      await getAccessTokenCommand.execute(cochlearId);
    } catch (e) {
      expect(e.message).to.equal('Error getting access token');
    }
  });
});
