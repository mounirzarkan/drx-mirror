'use strict';

const {
  cacheRefreshController,
  testRunController
} = require('./controller/index.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const configurations = require('./configuration/index.js');
const {log, utils} = require('./util/index.js');

async function deleteCache(event) {
  try {
    log.debug('event: ');
    log.debug(event);

    log.debug('handler - deleteCache - queryStringParameters: ');
    log.debug(event.queryStringParameters);

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    if (event.queryStringParameters) {
      const prefixName = event.queryStringParameters.prefixName;
      const appName = event.queryStringParameters.appName;
      const logicName = event.queryStringParameters.logicName;

      log.debug('handler - deleteCache - prefix: ');
      log.debug(prefixName);

      log.debug('handler - deleteCache - appName: ');
      log.debug(appName);

      log.debug('handler - deleteCache - logicName: ');
      log.debug(logicName);
      if (prefixName && utils.isValidName(prefixName)) {
        if (appName && utils.isValidName(appName)) {
          if (logicName === undefined || utils.isValidName(logicName)) {
            const response = await cacheRefreshController.deleteCache(
              prefixName,
              appName,
              logicName,
              configuration
            );

            log.debug('handler - deleteCache - response: ');
            log.debug(response);

            const successResponse = constructor.getPayloadResponse(
              '204',
              undefined,
              undefined
            );

            log.debug('handler - deleteCache - successResponse: ');
            log.debug(successResponse);

            return successResponse;
          } else {
            const respObj = {
              message:
                "Invalid query string, requires parameter 'logicName' to contain only a-z, A-Z, 0-9 or '-' characters."
            };
            return constructor.getPayloadResponse(
              '400',
              JSON.stringify(respObj),
              undefined
            );
          }
        } else {
          const respObj = {
            message:
              "Invalid query string, requires parameter 'appName' to contain only a-z, A-Z, 0-9 or '-' characters."
          };
          return constructor.getPayloadResponse(
            '400',
            JSON.stringify(respObj),
            undefined
          );
        }
      } else {
        const respObj = {
          message:
            "Invalid query string, requires parameter 'prefixName' to contain only a-z, A-Z, 0-9 or '-' characters."
        };
        return constructor.getPayloadResponse(
          '400',
          JSON.stringify(respObj),
          undefined
        );
      }
    }
  } catch (error) {
    log.error('handler - deleteCache - ERROR: ');
    log.error(error);
  }
  return constructor.getPayloadResponse(
    '500',
    JSON.stringify({message: 'Internal Server Error'})
  );
}

async function postTestRun(event) {
  try {
    log.debug('event: ');
    log.debug(event);

    const logicName =
      (event.queryStringParameters && event.queryStringParameters.logicName) ||
      'test';
    const identity =
      (event.queryStringParameters && event.queryStringParameters.identity) ||
      'deleteCache';

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    if (utils.isValidName(logicName) && utils.isValidName(identity)) {
      const testResults = await testRunController.postSaveCache(
        logicName,
        identity,
        configuration
      );

      log.debug('handler - postTestRun - testResults: ');
      log.debug(testResults);

      const deleteCacheEvent = {
        queryStringParameters: {
          prefixName: 'drx',
          appName: testResults.appName
        }
      };

      await deleteCache(deleteCacheEvent);

      const afterDeleteCache = await testRunController.getCacheValue(
        logicName,
        identity,
        configuration
      );

      testResults.afterDeleteCache = afterDeleteCache || 'none';
      const body = testResults;

      const successResponse = constructor.getPayloadResponse(
        '200',
        JSON.stringify(body),
        undefined
      );

      log.debug('handler - postTestRun - successResponse: ');
      log.debug(successResponse);

      return successResponse;
    } else {
      const respObj = {
        message:
          "Invalid query string, requires parameter 'logicName' & 'identity' can contain only a-z, A-Z, 0-9 or '-' characters."
      };
      return constructor.getPayloadResponse(
        '400',
        JSON.stringify(respObj),
        undefined
      );
    }
  } catch (error) {
    log.error('handler - postTestRun - ERROR: ');
    log.error(error);
  }

  return constructor.getPayloadResponse(500, 'Internal Server Error');
}

module.exports = {
  deleteCache,
  postTestRun
};
