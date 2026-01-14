'use strict';

const {isEmpty, isEqual} = require('lodash');
const {log, stringifyUtil} = require('./util/index.js');
const LOG_EVENTS = require('./common/data/eventConstants.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const configurations = require('./configuration/index.js');
const WebToCaseCommand = require('./commands/webToCaseCommand.js');

async function webToCase(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('=====> webToCase debug context: ');
  log.debug(context);
  log.debug('=====> webToCase debug event: ');
  log.debug(event);

  try {
    let payload = event.body;

    if (isEmpty(payload)) {
      payload = event;
    }

    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {});
    }

    const isBase64Encoded = str => {
      const base64Regex = /^[A-Za-z0-9+/=]+\s*$/;
      return base64Regex.test(str);
    };

    if (isBase64Encoded(payload)) {
      payload = Buffer.from(payload, 'base64').toString('utf-8');
      log.debug('=====> webToCase based64decoded payload');
      log.debug(payload);
    }

    const caseDataJson =
      typeof payload === 'string'
        ? JSON.parse(stringifyUtil.sanitiseString(payload))
        : payload;

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    const cmd = new WebToCaseCommand(configuration);

    const data = await cmd.execute(caseDataJson);

    const returnStr = JSON.stringify(data);

    return {
      statusCode: 200,
      body: returnStr,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  } catch (err) {
    return processWebCaseError(err);
  }
}

function processWebCaseError(err) {
  if (err) {
    log.error(err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      log.debug(err.response);
      log.debug(err.response.data);
      log.debug(err.response.status);
      log.debug(err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      log.debug(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      log.debug(err.message);
    }
  }

  log.error('error caught in WebCase function: ');
  console.error(err);
  log.error(err);
  let _statusCode = '500';
  let _title = 'Internal Server Error';
  let _errorCode = '500';
  let _detail = 'Internal Server Error';

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
  });
}

module.exports = {
  webToCase
};
