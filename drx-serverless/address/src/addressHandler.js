'use strict';

const {isEmpty, isEqual} = require('lodash');
const controllers = require('./controller/index.js');
const {
  utils,
  log,
  getUserFlow,
  USER_FLOW,
  getConfig,
  CONFIG_PROFILE
} = require('./util/index.js');
const {PMConnector} = require('./connector/index.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const configurations = require('./configuration/index.js');
const simulations = require('./simulation/index.js');
const _ = require('lodash');

async function postAddress(event, reqContext) {
  let updateAddressResponse;
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {AddressController} = controllers;

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const payload = event.body;
    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {
        Authorization: event.requestContext.authorizer.jwtToken
      });
    }

    const sanitisedBody = utils.sanitiseString(payload);
    const payloadJson = JSON.parse(sanitisedBody);

    const context = {};
    context.modifiedBy =
      event.requestContext.authorizer.firstName +
      ' ' +
      event.requestContext.authorizer.lastName;
    context.sub = event.requestContext.authorizer.sub;
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
        'postAddress'
      );
    }
    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );
    const addressController = new AddressController(userFlow, configuration);
    updateAddressResponse = await addressController.updateAddress(payloadJson, context);
  } catch (err) {
    log.error('error caught putAddress: ');
    log.error(err);

    if (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
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

    if (_.isEqual('451', err.message)) {
      _statusCode = 451;
      _title = 'Unavailable For Legal Reasons';
      _errorCode = '451';
      _detail =
        'Recipient address not allowed to be viewed by carer, if this recipient has multi carers.';
    }

    const _body = JSON.stringify(
      constructor.getErrorResponse(false, _title, _errorCode, _detail)
    );
    return constructor.getResponse(_statusCode, _body, {
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }

  return constructor.getResponse(200, JSON.stringify(updateAddressResponse), {
    Authorization: event.requestContext.authorizer.jwtToken
  });
}

// list of address for Boomi
async function getAddress(event, reqContext) {
  try {
    /** Immediate response for WarmUP plugin */
    // if (event.source === 'serverless-plugin-warmup') {
    //   log.debug('This is a warmup request!');
    //   return callback(null, 'Lambda getAddress is warm!');
    // }

    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {AddressController} = controllers;
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const context = {};
    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;
    context.addressId =
      (event &&
        event.queryStringParameters &&
        event.queryStringParameters.addressId) ||
      '';

    log.debug('context');
    log.debug(context);

    await configuration.init();

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      log.debug('event.requestContext.authorizer.sub');
      log.debug(event.requestContext.authorizer.sub);

      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getAddress'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getAddress(context.obj);
      log.debug('getAddress, pmGetAddress: - mockedResponse');
      log.debug(mockedResponse);

      const returnStr = JSON.stringify({
        success: true,
        data: {
          address: mockedResponse.data.address
        }
      });

      const response = constructor.getResponse(200, returnStr, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
      return response;
    }

    const addressController = new AddressController(userFlow, configuration);
    const currentAddress = await addressController.retrieveAddress(context);

    const returnStr = JSON.stringify({
      success: true,
      data: {
        address: currentAddress
      }
    });

    return constructor.getResponse(200, returnStr, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  } catch (err) {
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

    log.error('error caught getAddress: ');
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

    if (isEqual('451', err.message)) {
      _statusCode = 451;
      _title = 'Unavailable For Legal Reasons';
      _errorCode = '451';
      _detail =
        'Recipient address not allowed to be viewed by carer, if this recipient is underage and/or has multi carers.';
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

// only available for Boomi
// patch for primary types/tags
async function patchAddress(event, reqContext) {
  let patchAddressResponse;
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const {AddressController} = controllers;

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const payload = event.body;
    if (isEmpty(payload)) {
      const _body = JSON.stringify(
        constructor.getErrorResponse(false, 'Bad Request', '400', 'Bad Request')
      );
      return constructor.getResponse(400, _body, {
        Authorization: event.requestContext.authorizer.jwtToken
      });
    }

    const sanitisedBody = utils.sanitiseString(payload);
    const payloadJson = JSON.parse(sanitisedBody);

    const context = {};
    context.modifiedBy =
      event.requestContext.authorizer.firstName +
      ' ' +
      event.requestContext.authorizer.lastName;
    context.sub = event.requestContext.authorizer.sub;
    context.obj = event.requestContext.authorizer.obj;
    context.addressId = event.queryStringParameters?.addressId || '';
    context.countryCode = event.requestContext.authorizer.countryCode;

    log.debug('context');
    log.debug(context);

    await configuration.init();

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'patchAddress'
      );
    }
    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );
    const addressController = new AddressController(userFlow, configuration);
    patchAddressResponse = await addressController.patchAddress(payloadJson, context);
  } catch (err) {
    log.error('error caught patchAddress: ');
    log.error(err);

    if (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
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

    if (_.isEqual('451', err.statusCode)) {
      _statusCode = 451;
      _title = 'Unavailable For Legal Reasons';
      _errorCode = '451';
      _detail = 'Address not allowed to be updated.';
    }
    if (_.isEqual('409', err.statusCode)) {
      _statusCode = 409;
      _title = 'Address tags conflict';
      // TODO address tags conflict
      // TODO - scenario where patch becomes create address and street+city+etc combination is the same
      _errorCode = '409';
      _detail = err.message;
    }

    const _body = JSON.stringify(
      constructor.getErrorResponse(false, _title, _errorCode, _detail)
    );
    return constructor.getResponse(_statusCode, _body, {
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }

  return constructor.getResponse(200, JSON.stringify(patchAddressResponse), {
    Authorization: event.requestContext.authorizer.jwtToken
  });
}

module.exports = {
  getAddress,
  postAddress,
  patchAddress
};
