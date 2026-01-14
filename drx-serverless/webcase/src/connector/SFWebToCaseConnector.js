'use strict';

const {log} = require('../common/utils/index.js');
const request = require('request');

class SFWebToCaseConnector {
  constructor(params) {
    this.sfhcWebToCaseEndpoint = params.sfhcWebToCaseEndpoint;
    console.log(
      '=====> SFWebToCaseConnector: sfhcWebToCaseEndpoint = ' +
        params.sfhcWebToCaseEndpoint
    );
  }

  async webToCase(reqBody) {
    log.debug('=====> SFWebToCaseConnector, webToCase - reqBody:');
    log.debug(reqBody);

    return new Promise((resolve, reject) => {
      const requestObject = {
        url: this.sfhcWebToCaseEndpoint, // Defined in CI/CD Variables
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'encoding': 'utf-8'
        },
        body: reqBody
      };

      log.debug('=====> SFWebToCaseConnector, webToCase - requestObject:');
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

module.exports = SFWebToCaseConnector;
