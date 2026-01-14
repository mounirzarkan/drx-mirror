'use strict';

const {isEmpty, isEqual} = require('lodash');
const {
  utils,
  log,
  getUserFlow,
  USER_FLOW,
  getConfig,
  CONFIG_PROFILE
} = require('./util/index');
const {PMConnector} = require('./connector/index');
const constructor = require('./constructor/responsePayloadConstructor');
const controllers = require('./controller/index');
const configurations = require('./configuration/index');
const simulations = require('./simulation/index');

async function patchUserInfo(event, reqContext) {
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {AccountController} = controllers;
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);
    const payload = event.body;

    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
    }

    const sanitisedBody = utils.sanitiseString(payload);

    const context = {};
    context.modifiedBy =
      event.requestContext.authorizer.firstName +
      ' ' +
      event.requestContext.authorizer.lastName;
    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.countryCode = event.requestContext.authorizer.countryCode;
    context.obj = event.requestContext.authorizer.obj;

    log.debug('context');
    log.debug(context);

    const payloadJson = JSON.parse(sanitisedBody);

    log.debug('payload JSON');
    log.debug(payloadJson);

    await configuration.init();

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'patchUserInfo'
      );
    }
    log.debug('configuration');
    log.debug(configuration);

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );
    const accountController = new AccountController(userFlow, configuration);
    await accountController.patchAccount(payloadJson, context);

    log.debug('after invoking patchAccount');
  } catch (err) {
    if (err) {
      log.error('error caught patchUserInfo: ');
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

    if (isEqual('451', err.message)) {
      _statusCode = 451;
      _title = 'Unavailable For Legal Reasons';
      _errorCode = '451';
      _detail = 'Carer details not allowed to be updated by recipient.';
    }

    const _body = JSON.stringify(
      constructor.getErrorResponse(false, _title, _errorCode, _detail)
    );
    return constructor.getResponse(_statusCode, _body, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }

  return constructor.getResponse(200, undefined, {
    'Access-Control-Expose-Headers':
      'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
    Authorization: event.requestContext.authorizer.jwtToken
  });
}

async function getUserInfo(event, reqContext) {
  try {
    /** Immediate response for WarmUP plugin */
    // if (event.source === 'serverless-plugin-warmup') {
    //   log.info('This is a warmup request!');

    //   return callback(null, 'Lambda getUserInfo is warm!');
    // }

    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {EnvironmentConfiguration} = configurations;
    const {AccountController} = controllers;

    const configuration = new EnvironmentConfiguration(process.env);
    const context = {};
    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;

    log.debug('context');
    log.debug(context);

    await configuration.init();

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getUserInfo'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );
    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getUserInfo(context.obj);
      log.debug('getUserInfo, pmGetUserInfo: - mockedResponse');
      log.debug(mockedResponse);

      const returnStr = JSON.stringify({
        success: true,
        data: {
          account: mockedResponse.data.account
        }
      });

      const response = constructor.getResponse(200, returnStr, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
      return response;
    }

    const accountController = new AccountController(userFlow, configuration);
    const account = await accountController.getAccount(context);

    log.debug('account to be returned: ');
    log.debug(account);
    log.trace(account);

    const returnStr = JSON.stringify({
      success: true,
      data: account
    });

    return constructor.getResponse(200, returnStr, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  } catch (err) {
    if (err) {
      log.error('error caught getUserInfo: ');
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

    let _statusCode = 500;
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
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}

async function getUserIdentity(event, reqContext) {
  try {
    /** Immediate response for WarmUP plugin */
    // if (event.source === 'serverless-plugin-warmup') {
    //   log.info('This is a warmup request!');

    //   return callback(null, 'Lambda getUserInfo is warm!');
    // }

    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {EnvironmentConfiguration} = configurations;
    const {AccountController} = controllers;

    const configuration = new EnvironmentConfiguration(process.env);
    const context = {};
    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;

    log.debug('context');
    log.debug(context);

    await configuration.init();

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getUserIdentity'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );
    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      // TODO
    }

    const accountController = new AccountController(userFlow, configuration);
    const userIdentity = await accountController.getUserIdentity(context);

    log.debug('account to be returned: ');
    log.debug(userIdentity);
    log.trace(userIdentity);

    const returnStr = JSON.stringify({
      success: true,
      data: userIdentity
    });

    return constructor.getResponse(200, returnStr, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  } catch (err) {
    console.log('error', err);
    log.error('error caught getUserIdentity: ');
    log.error(err);

    let _statusCode = 500;
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
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}

module.exports = {
  getUserInfo,
  getUserIdentity,
  patchUserInfo
};
