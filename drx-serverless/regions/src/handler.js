'use strict';

const {isEqual} = require('lodash');
const controllers = require('./controller/index.js');
const {log} = require('./common/utils/index.js');
const constructor = require('./common/utils/responsePayload.js');
const configurations = require('./configuration/index.js');

async function getRegions(event, reqContext) {
  try {
    log.info('getRegions request start...');
    log.info(event);
    log.info(reqContext);

    const {RegionController} = controllers;

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const country = event.queryStringParameters?.country || '';
    const lng = event.queryStringParameters?.lng || 'en';
    const source = event.queryStringParameters?.src || '';

    await configuration.init();

    const regionController = new RegionController(configuration);

    const regions = await regionController.retrieveCountryData(
      country,
      lng,
      source
    );

    log.info(regions);

    const returnStr = JSON.stringify({
      success: true,
      data: regions
    });

    return constructor.getResponse(200, returnStr, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
    });
  } catch (err) {
    log.error('error caught regions: ');
    log.error(err);
    let _statusCode = '500';
    let _title = 'reached API, Internal Server Error';
    ``;
    let _errorCode = '500';
    let _detail = 'reached API, Internal Server Error';

    if (isEqual('403', err.message)) {
      _statusCode = 403;
      _title = 'Not Authorized to query';
      _errorCode = '403';
      _detail = 'Not Authorized to query';
    }

    const _body = JSON.stringify(
      constructor.getErrorResponse(false, _title, _errorCode, _detail)
    );

    return constructor.getResponse(_statusCode, _body, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      //Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}

module.exports = {
  getRegions
};
