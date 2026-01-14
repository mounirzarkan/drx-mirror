'use restrict';

const {isEqual} = require('lodash');
const loginController = require('./controller/loginController.js');
const _getAuth0LoginURL = loginController.getAuth0LoginURL;
const _getToken = loginController.getToken;
const _revokeToken = loginController.revokeToken;
const configurations = require('./configuration/index.js');
const log = require('./util/logUtil.js');
const {getConfig, CONFIG_PROFILE} = require('./util/getConfig.js');
const LOG_EVENTS = require('./data/eventConstants.js');

async function login(event) {
  console.time('TIME-lamba-getLoginUrl');

  log.essential(LOG_EVENTS.API_START);

  log.debug('event: ');
  log.debug(event);

  const {EnvironmentConfiguration} = configurations;
  const configuration = new EnvironmentConfiguration(process.env);

  const {queryStringParameters} = event;
  configuration.app = queryStringParameters?.app
    ? queryStringParameters.app
    : 'dcx';
  log.debug('configuration.app: ');
  log.debug(configuration.app);

  const returnStr = _getAuth0LoginURL(configuration);

  return {
    statusCode: 302,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Location: returnStr
    }
  };
}

async function getToken(event) {
  console.time('TIME-lamba-getToken');

  log.essential(LOG_EVENTS.API_START);

  let code = null;

  if (event && event.body && event.body.includes('code')) {
    code = JSON.parse(event.body).code;
  } else {
    return {
      statusCode: 400,
      body: 'Invalid request.',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  const {EnvironmentConfiguration} = configurations;
  const configuration = new EnvironmentConfiguration(process.env);

  await configuration.init();

  const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

  try {
    log.debug('authcode: ');
    log.debug(code);

    log.debug('configuration: ');
    log.debug(configuration);

    console.time('TIME-getToken');
    const tokenObj = await _getToken(code, configuration, appConfig);
    console.timeEnd('TIME-getToken');

    console.timeEnd('TIME-lamba-getToken');

    return {
      statusCode: 200,
      body: JSON.stringify(tokenObj),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    log.error('caught error while call getToken: ');
    log.error(error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      log.debug(error.response.data);
      log.debug(error.response.status);
      log.debug(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      log.debug(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      log.debug(error.message);
    }

    console.timeEnd('TIME-lamba-getToken');

    let body = 'Internal Server Error';

    if (isEqual('417', error.message)) {
      body = JSON.stringify({
        success: error.success,
        errors: error.errors
      });
    }

    return {
      statusCode: error.statusCode || 500,
      body,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}

async function revokeToken(event) {
  try {
    log.essential(LOG_EVENTS.API_START);

    let token = null;
    if (event && event.body && event.body.includes('token')) {
      token = JSON.parse(event.body).token;
    } else {
      return {
        statusCode: 400,
        body: 'Invalid request.',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    await _revokeToken(token, configuration);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (e) {
    log.error('revokeToken error: ');
    log.error(e);
  }
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
}

module.exports = {
  login,
  getToken,
  revokeToken
};
