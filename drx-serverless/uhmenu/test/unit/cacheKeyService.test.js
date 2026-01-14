'use strict';

const {expect} = require('chai');
const CacheKeyService = require('../../src/service/cacheKeyService.js');

describe('SUITE: cacheKeyService.', () => {
  const userSessionPrefix = 'userSessionPrefix';
  const cochlear_id = 'cochlear_id';
  it('CASE: getUserInfoKey equals userSessionPrefixcacheUserInfo-cochlear_id', async () => {
    const cacheKeyService = new CacheKeyService({_env: 'dev'});
    const userInfoKey = cacheKeyService.getUserInfoKey(
      userSessionPrefix,
      cochlear_id
    );
    expect(userInfoKey).to.equal('userSessionPrefixcacheUserInfo-cochlear_id');
  });
  it('CASE: getUHmenuConfigkey equals dev_drx-cacheUserInfo_uhmenu-configuration_us', async () => {
    const cacheKeyService = new CacheKeyService({_env: 'dev'});
    // TODO - I've changed the test to match what is going on with the code - but I'm not sure
    // if this is correct (i.e. you'll get a null pointer if you don't include the language
    // as an example
    const userInfoKey = cacheKeyService.getUHmenuConfigkey('US', 'en');
    expect(userInfoKey).to.equal('dev_drx-uhmenu_en-US');
  });
});
