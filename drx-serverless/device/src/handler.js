'use strict';

const configurations = require('./configuration/index.js');
const controllers = require('./controller/index.js');

const {PMConnector} = require('./connector/index.js');
const {ServiceRequest} = require('./service/index.js');
const {
  log,
  utils,
  getUserFlow,
  USER_FLOW,
  getConfig,
  CONFIG_PROFILE
} = require('./util/index.js');
const LOG_EVENTS = require('./data/eventConstants.js');
const simulations = require('./simulation/index.js');
const {IS_LOCAL} = process.env;
console.log('sls is_local: ', IS_LOCAL);

async function getDevicesList(event) {
  try {
    log.essential(LOG_EVENTS.API_START);

    log.debug('event ');
    log.debug(event);

    const filterParams = {
      filterValue: event.queryStringParameters?.filterValue,
      filterField: event.queryStringParameters?.filterField
    };

    log.debug('filterParams');
    log.debug(filterParams);

    const sortParams = {
      sortField: event.queryStringParameters?.sortField,
      sortOrder: event.queryStringParameters?.sortOrder
    };

    log.debug('sortParams');
    log.debug(sortParams);

    const page = event.queryStringParameters?.page;

    log.debug('page');
    log.debug(page);

    const flatten = event.queryStringParameters?.flatten === '1';

    log.debug('flatten');
    log.debug(flatten);

    const queryParams = {
      filterParams,
      sortParams,
      page,
      flatten
    };

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    configuration.hasDeviceSupport = configuration.deviceSupportCountries.some(
      (country) =>
        country === event.requestContext.authorizer.countryCode.toUpperCase()
    );

    configuration.cochlearId =
      event.requestContext.authorizer.obj ||
      event.requestContext.authorizer.sub;
    configuration.countryCode = event.requestContext.authorizer.countryCode;
    configuration.obj = event.requestContext.authorizer.obj;
    configuration.sub = event.requestContext.authorizer.sub;

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      log.debug('cochlearId');
      log.debug(configuration.cochlearId);

      // simulate error response for error users
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getDevicesList'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      configuration.cochlearId,
      configuration.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getDeviceList(
        configuration.cochlearId
      );

      log.debug('handler.getDeviceList, pmGetDeviceList: - mockedResponse');
      log.debug(mockedResponse);

      return {
        statusCode: 200,
        body: JSON.stringify(mockedResponse),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers':
            'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
          Authorization: event.requestContext.authorizer.jwtToken
        }
      };
    }
    const {DeviceController} = controllers;
    const deviceController = new DeviceController(
      userFlow,
      configuration,
      queryParams
    );
    const devicesListStr = await deviceController.getDevicesList(configuration);

    log.debug('handler.getDeviceList: - devicesListStr');
    log.debug(devicesListStr);

    return {
      statusCode: 200,
      body: devicesListStr,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      }
    };
  } catch (err) {
    log.error('caught error while getDeviceList: ');
    log.error(err);
    console.error(err);

    let _statusCode = '500';
    let _title = 'Internal Server Error';
    let _errorCode = '500';
    let _detail = 'Internal Server Error';
    if (err.isAxiosError) {
      log.error(err.response);
      log.error(err.response.data);
      _statusCode = err.response.status;
      _title = err.response.statusText;
      if (401 === _statusCode) {
        _errorCode = err.response.data[0].errorCode;
        _detail = err.response.data[0].message;
      } else {
        const sfError = err.response.data.errors[0];
        _errorCode = sfError.code;
        _detail = sfError.message;
      }
    }
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
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      }
    };
  }
}

async function getDevice(event) {
  try {
    log.essential(LOG_EVENTS.API_START);

    log.debug('event');
    log.debug(event);

    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    await configuration.init();

    configuration.hasDeviceSupport = configuration.deviceSupportCountries.some(
      (country) =>
        country === event.requestContext.authorizer.countryCode.toUpperCase()
    );
    configuration.cochlearId =
      event.requestContext.authorizer.obj ||
      event.requestContext.authorizer.sub;
    configuration.countryCode = event.requestContext.authorizer.countryCode;
    configuration.obj = event.requestContext.authorizer.obj;
    configuration.sub = event.requestContext.authorizer.sub;

    configuration.deviceId =
      (event &&
        event.queryStringParameters &&
        event.queryStringParameters.deviceId) ||
      '';

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      log.debug('cochlearId');
      log.debug(configuration.cochlearId);

      // simulate error response for error users
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getDevice'
      );
    }

    let device;

    const userFlow = await getUserFlow(
      appConfig,
      configuration.cochlearId,
      configuration.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      device = await pmConnector.getDevice(
        configuration.cochlearId,
        configuration.deviceId
      );

      log.debug('handler.getDevice, pmGetDevice: - mockedResponse');
      log.debug(device);
    }

    if (userFlow !== USER_FLOW.LAMBDA_MOCK) {
      const {DeviceController} = controllers;
      const deviceController = new DeviceController(userFlow, configuration);
      device = await deviceController.getDevice(configuration);

      log.debug('handler.getDevice, deviceController: - device');
      log.debug(device);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(device),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      }
    };
  } catch (err) {
    log.error('caught error while getDevice: ');
    log.error(err);
    console.error(err);

    let _statusCode = '500';
    let _title = 'Internal Server Error';
    let _errorCode = '500';
    let _detail = 'Internal Server Error';
    if (err.isAxiosError) {
      log.error(err.response);
      log.error(err.response.data);
      _statusCode = err.response.status;
      _title = err.response.statusText;
      if (401 == _statusCode) {
        _errorCode = err.response.data[0].errorCode;
        _detail = err.response.data[0].message;
      } else {
        const sfError = err.response.data.errors[0];
        _errorCode = sfError.code;
        _detail = sfError.message;
      }
    }
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
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      }
    };
  }
}

async function submitServiceRequest(event) {
  log.essential(LOG_EVENTS.API_START);

  const sanitisedBody = utils.sanitiseString(event.body);

  const cochlear_id = event.requestContext.authorizer.sub;

  try {
    const body = JSON.parse(sanitisedBody);
    await ServiceRequest.submitRequest(cochlear_id, body);
  } catch (err) {
    log.error('err: ');
    log.error(err);

    if (err instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers':
            'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
          Authorization: event.requestContext.authorizer.jwtToken
        }
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers':
            'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
          Authorization: event.requestContext.authorizer.jwtToken
        }
      };
    }
  }
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    }
  };
}

module.exports = {
  getDevicesList,
  submitServiceRequest,
  getDevice
};
