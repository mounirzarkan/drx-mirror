'use strict';

const {expect} = require('chai');

const cacheKeyService = require('../../src/service/cacheKeyService');

describe('SUITE: CacheKeyService.', () => {
  const config = {
    Environment: 'dev'
  };
  const service = new cacheKeyService(config);

  it('CASE: check 200', async () => {
    try {
      const tes = service.getBoomiHeaderFooterKey('en', 'us');
      expect(tes.includes('en')).to.be.true;
    } catch (error) {
      console.log(error);
      expect(false).to.be.true;
    }
  });
});
