'use strict';
const {log} = require('../util/index.js');
const {TestRunService} = require('../service/index.js');

async function postSaveCache(logicName, identity, config) {
  log.debug('testRunController.postTestRun, logicName:');
  log.debug(logicName);

  log.debug('testRunController.postTestRun, identity:');
  log.debug(identity);

  const testRunService = new TestRunService(config);
  const response = await testRunService.postSaveCache(logicName, identity);

  log.debug('testRunController.postTestRun, response:');
  log.debug(response);

  return response;
}

async function getCacheValue(logicName, identity, config) {
  log.debug('testRunController.postTestRun, logicName:');
  log.debug(logicName);

  log.debug('testRunController.postTestRun, identity:');
  log.debug(identity);

  const testRunService = new TestRunService(config);
  const response = await testRunService.getCacheValue(logicName, identity);

  log.debug('testRunController.postTestRun, response:');
  log.debug(response);

  return response;
}

module.exports = {postSaveCache, getCacheValue};
