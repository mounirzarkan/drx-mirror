'use strict';

const {log} = require('../common/utils/index.js');
const request = require('request');

class SFClassicWebToCaseConnector {
  constructor(params) {
    this.sfClassicWebToCaseEndpoint = params.sfClassicWebToCaseEndpoint;
    console.log(
      '=====> SFClassicWebToCaseConnector: sfClassicWebToCaseEndpoint = ' +
        params.sfClassicWebToCaseEndpoint
    );
  }

  async webToCase(reqBody) {
    log.debug('=====> SFClassicWebToCaseConnector, webToCase - reqBody:');
    log.debug(reqBody);

    return new Promise((resolve, reject) => {
      const requestObject = {
        url: this.sfClassicWebToCaseEndpoint, // Defined in CI/CD Variables
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'encoding': 'utf-8'
        },
        body: reqBody
      };

      log.debug('=====> SFClassicWebToCaseConnector, webToCase - requestObject:');
      log.debug(requestObject);
      request(requestObject, function requestCallback(err, response, body) {
        if (
          !err &&
          (response.statusCode == 200 || response.statusCode == 201)
        ) {
          return resolve(body);
        } else {
          log.debug(
            'Unable to process request with Salesforce. Received the following status: ' +
              response.statusCode +
              '. Error: ' +
              err
          );
          reject(err);
        }
      });
    });
  }
}

module.exports = SFClassicWebToCaseConnector;
