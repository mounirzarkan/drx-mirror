'use strict';

const {isEmpty} = require('lodash');
const {log, stringifyUtil} = require('./common/utils/index.js');
const LOG_EVENTS = require('./common/data/eventConstants.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const configurations = require('./configuration/index.js');
const {convertPhoneNumber} = require('./commands/convertPhone.js');
const CacheCommands = require('./commands/cache.js');
const GetAddressConfigCommand = require('./commands/getAddressConfigCommand.js');
const GetDictionaryItemsCommand = require('./commands/getDictionaryItemsCommand.js');
const SendMailCommand = require('./commands/sendMailCommand.js');
const UpdateLoginCommand = require('./commands/updateLoginCommand.js');

async function convertPhone(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  try {
    const phoneNumber =
      event && event.pathParameters && event.pathParameters.phoneNumber;
    console.log('phoneNumber:' + phoneNumber);

    const responseData = convertPhoneNumber(phoneNumber);

    const returnStr = JSON.stringify({
      success: true,
      data: responseData
    });

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
    log.error('error caught convertPhone: ');
    log.error(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function getAddressConfig(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  try {
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);
    await configuration.init();

    const cmd = new GetAddressConfigCommand(configuration);

    const ctry = event && event.pathParameters && event.pathParameters.country;
    const lng = event && event.pathParameters && event.pathParameters.lng;
    const src = event.queryStringParameters.src;

    const response = await cmd.execute(ctry, lng, src);

    const returnStr = JSON.stringify({
      success: true,
      data: response
    });

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
    log.error('error caught getAddressConfig: ');
    log.error(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function getDictionaryItems(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  try {
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);
    await configuration.init();

    const cmd = new GetDictionaryItemsCommand(configuration);

    const lng = event && event.pathParameters && event.pathParameters.lng;

    const response = await cmd.execute(lng);

    // Return the dictionary data directly (JSS format)
    const returnStr = JSON.stringify(response);

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
    log.error('error caught getDictionaryItems: ');
    log.error(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function getCache(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  const {cacheApiKey, environment} = process.env;

  log.debug('cacheApiKey: ');
  log.debug(cacheApiKey);
  log.debug('environment: ');
  log.debug(environment);

  if (event.headers['X-Cache-Api-Key'] !== cacheApiKey) {
    const _body = JSON.stringify(
      constructor.getErrorResponse(false, 'Unauthorized', '401', 'Unauthorized')
    );
    return constructor.getResponse(401, _body, {});
  }

  if (!['dev', 'sit', 'uat'].includes(environment)) {
    const _body = JSON.stringify(
      constructor.getErrorResponse(false, 'Forbidden', '403', 'Forbidden')
    );
    return constructor.getResponse(403, _body, {});
  }

  try {
    const cacheKey = event && event.pathParameters && event.pathParameters.key;

    if (!cacheKey) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {});
    }

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);
    await configuration.init();

    const cache = new CacheCommands(configuration);
    const cacheResponse = await cache.getCache(cacheKey);

    log.debug('getCache: - cache');
    log.debug(cacheResponse);

    const returnStr = JSON.stringify({
      success: true,
      data: cacheResponse
    });

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
    log.error('error caught getCache: ');
    log.error(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function postCache(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);
  log.debug('process.env: ');
  log.debug(process.env);

  const {cacheApiKey, environment} = process.env;

  log.debug('cacheApiKey: ');
  log.debug(cacheApiKey);
  log.debug('environment: ');
  log.debug(environment);

  if (event.headers['X-Cache-Api-Key'] !== cacheApiKey) {
    const _body = JSON.stringify(
      constructor.getErrorResponse(false, 'Unauthorized', '401', 'Unauthorized')
    );
    return constructor.getResponse(401, _body, {});
  }

  if (!['dev', 'sit', 'uat'].includes(environment)) {
    const _body = JSON.stringify(
      constructor.getErrorResponse(false, 'Forbidden', '403', 'Forbidden')
    );
    return constructor.getResponse(403, _body, {});
  }

  try {
    const payload = event.body;

    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {});
    }

    const sanitisedBody = stringifyUtil.sanitiseString(payload);
    const payloadJson = JSON.parse(sanitisedBody);

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);
    await configuration.init();

    const cache = new CacheCommands(configuration);
    const cacheResponse = await cache.updateCache(payloadJson);

    log.debug('postCache: - cache');
    log.debug(cacheResponse);

    const returnStr = JSON.stringify({
      success: true,
      data: cacheResponse
    });

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
    log.error('error caught postCache: ');
    log.error(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function sendMail(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  try {
    let payload = event.body;

    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {});
    }

    const isBase64Encoded = (str) => {
      const base64Regex = /^[A-Za-z0-9+/=]+\s*$/;
      return base64Regex.test(str);
    };

    if (isBase64Encoded(payload)) {
      payload = Buffer.from(payload, 'base64').toString('utf-8');
      log.debug('based64decoded payload');
      log.debug(payload);
    }

    const sanitisedBody = stringifyUtil.sanitiseString(payload);
    const payloadJson = JSON.parse(sanitisedBody);

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    const cmd = new SendMailCommand(configuration);

    const data = await cmd.execute(payloadJson);

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
    log.error('error caught sendMail: ');
    log.debug(err);

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

async function updateLogin(event, context) {
  log.essential(LOG_EVENTS.API_START);

  log.debug('debug context: ');
  log.debug(context);
  log.debug('debug event: ');
  log.debug(event);

  try {
    const payload = event.body;

    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {});
    }
    const sanitisedBody = stringifyUtil.sanitiseString(payload);
    const payloadJson = JSON.parse(sanitisedBody);
    payloadJson.customerIdentifier = event.requestContext.authorizer.obj;

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    const cmd = new UpdateLoginCommand(configuration);

    await cmd.execute(payloadJson);

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  } catch (err) {
    log.error('error caught updateLogin: ');

    const _statusCode = '500';
    const _title = 'Internal Server Error';
    const _errorCode = '500';
    const _detail = 'Internal Server Error';

    const _body = JSON.stringify({
      success: false,
      errors: [
        {
          title: _title,
          errorCode: _errorCode,
          detail: _detail
        }
      ]
    });

    return {
      statusCode: _statusCode,
      body: _body,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
      }
    };
  }
}

module.exports = {
  convertPhone,
  getCache,
  postCache,
  getAddressConfig,
  getDictionaryItems,
  sendMail,
  updateLogin
};
