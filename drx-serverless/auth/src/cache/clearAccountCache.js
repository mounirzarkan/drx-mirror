const log = require('../util/logUtil.js');
const USER_ACCOUNT_KEY_PREFIX = 'account-getAccount-';

// clear account data in redis
async function clearAccountCache(params, cochlearId) {
  if (cochlearId) {
    const accountDataKey =
      params.userSessionPrefix +
      USER_ACCOUNT_KEY_PREFIX +
      cochlearId +
      '-' +
      cochlearId;
    log.debug('clearAccountCache - accountDataKey');
    log.debug(accountDataKey);
    await params.cache.delete(accountDataKey);
  } else {
    log.debug('clearAccountCache - empty cochlearId');
    log.debug(cochlearId);
  }
}

module.exports = {
  clearAccountCache
};
