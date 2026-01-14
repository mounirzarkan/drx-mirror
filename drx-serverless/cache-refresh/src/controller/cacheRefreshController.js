'use strict';
const {log} = require('../util/index.js');
const {CacheRefreshService} = require('../service/index.js');

async function deleteCache(prefixName, appName, logicName, config) {
  log.debug('appName:');
  log.debug(appName);

  log.debug('logicName:');
  log.debug(logicName);

  const cacheRefreshService = new CacheRefreshService(config);
  const response = await cacheRefreshService.deleteCache(
    prefixName,
    appName,
    logicName
  );

  log.debug('cacheRefreshController.deleteCache, result:');
  log.debug(response);

  return response;
}

module.exports = {deleteCache};
