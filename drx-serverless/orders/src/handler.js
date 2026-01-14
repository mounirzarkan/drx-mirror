'use strict';

const {
  log,
  getUserFlow,
  USER_FLOW,
  getConfig,
  CONFIG_PROFILE
} = require('./util/index.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const controllers = require('./controller/index.js');
const {PMConnector} = require('./connector/index.js');
const configurations = require('./configuration/index.js');
const ErrorEvent = require('./event/errorEvent.js');
const simulations = require('./simulation/index.js');
const jwtHelpers = require('./util/jwtHelpers.js');

function logError(error) {
  log.error('handler - ERROR: ');
  log.error(error);
  console.log('error', error);
  if (error.response) {
    log.debug(error.response.data);
    log.debug(error.response.status);
    log.debug(error.response.headers);
  } else if (error.request) {
    log.debug(error.request);
  }
}

async function getOrderHeaders(event) {
  log.debug('getOrderHeaders - event: ');
  log.debug(event);

  const {
    jwtToken,
    countryCode,
    sub,
    obj: cochlearId
  } = event?.requestContext?.authorizer || {};

  const {search: filterQueryStr} = event.queryStringParameters || '';

  const page = event.queryStringParameters?.page || 1;

  const filterItems = filterQueryStr?.split(',') || [];

  log.debug('getOrderHeaders - getRequestContext - countryCode: ');
  log.debug(countryCode);

  log.debug('getOrderHeaders - getRequestContext - cochlearId: ');
  log.debug(cochlearId);

  log.debug('getOrderHeaders - filterItems: ');
  log.debug(filterItems);

  log.debug('getOrderHeaders - page: ');
  log.debug(page);

  try {
    const {OrdersController} = controllers;
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    log.debug('getOrderHeaders - configuration: ');
    log.debug(configuration);

    // initialize environment configuration
    await configuration.init();

    log.debug('getOrderHeaders - configuration.init(): ');
    log.debug(configuration);

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      // simulate error response for error users
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getOrderHeaders'
      );
    }

    const userFlow = await getUserFlow(appConfig, cochlearId, countryCode);

    const days = appConfig.variables?.orderLimit || 60;

    log.debug('getOrderHeaders - days: ');
    log.debug(days);

    const queryPartyIdStr = jwtHelpers.getPartyIdForCochlearId(
      jwtToken,
      cochlearId
    );

    log.debug('getOrderHeaders - queryPartyIdStr: ');
    log.debug(queryPartyIdStr);

    const queryPartyId = queryPartyIdStr
      ? JSON.parse(queryPartyIdStr)
      : undefined;

    log.debug('getOrderHeaders - queryPartyId: ');
    log.debug(queryPartyId);

    if (
      userFlow === USER_FLOW.DEFAULT &&
      (queryPartyId === undefined || queryPartyId === null)
    ) {
      // couldnt find information
      const errorEvent = new ErrorEvent(404, false, '404', 'Not Found');
      return constructor.getResponse(404, errorEvent.getPayloadStr(), {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: jwtToken
      });
    }

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getOrderHeaders(cochlearId);

      log.debug('getOrderHeaders, pmGetOrderHeaders: - mockedResponse');
      log.debug(mockedResponse);

      const data = constructor.getDataObj({
        orderHeaders: mockedResponse.data.orderHeaders
      });
      const response = constructor.getResponse(200, JSON.stringify(data), {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: jwtToken
      });
      return response;
    }

    const ordersController = new OrdersController(userFlow, configuration);

    const orderHeaders = await ordersController.getOrdersList({
      id: userFlow === USER_FLOW.DEFAULT ? queryPartyId : cochlearId,
      sub,
      filterItems,
      days,
      countryCode,
      page
    });

    log.debug('getOrderHeaders - orderHeaders: ');
    log.debug(orderHeaders);

    const data = constructor.getDataObj({orderHeaders: orderHeaders});

    log.debug('getOrderHeaders - data: ');
    log.debug(data);

    const response = constructor.getResponse(200, JSON.stringify(data), {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: jwtToken
    });
    return response;
  } catch (error) {
    logError(error);
  }
  const errorEvent = new ErrorEvent(500, false, '500', 'Internal Server Error');
  return constructor.getResponse(500, errorEvent.getPayloadStr(), {
    'Access-Control-Expose-Headers':
      'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
    Authorization: jwtToken
  });
}

async function getOrderLines(event) {
  log.debug('getOrderLines - event: ');
  log.debug(event);

  const {
    jwtToken,
    countryCode,
    sub,
    obj: cochlearId
  } = event?.requestContext?.authorizer || {};

  const {search: filterQueryStr} = event?.queryStringParameters || '';

  const filterItems = filterQueryStr?.split(',') || [];

  const {orderId} = event?.pathParameters || {};

  log.debug('getOrderLines - getRequestContext - countryCode: ');
  log.debug(countryCode);

  log.debug('getOrderLines- getRequestContext - cochlearId: ');
  log.debug(cochlearId);

  log.debug('getOrderLines - filterItems: ');
  log.debug(filterItems);

  log.debug('getOrderLines - orderId: ');
  log.debug(orderId);

  try {
    const {OrdersController} = controllers;
    const {EnvironmentConfiguration} = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    log.debug('getOrderLines - configuration: ');
    log.debug(configuration);

    // initialize environment configuration
    await configuration.init();

    log.debug('getOrderLines - configuration.init(): ');
    log.debug(configuration);

    const appConfig = await getConfig(CONFIG_PROFILE.EXPERIENCE_API);

    if (configuration.isTestEnvironment()) {
      log.debug('getOrderLines - appConfig:');
      log.debug(appConfig);

      // simulate error response for error users
      const responseSimulation = new simulations.ResponseSimulation(appConfig);
      responseSimulation.simulate(
        event.requestContext.authorizer.sub,
        'getOrderLines'
      );
    }

    const userFlow = await getUserFlow(appConfig, cochlearId, countryCode);

    const queryPartyIdStr = jwtHelpers.getPartyIdForCochlearId(
      jwtToken,
      cochlearId
    );

    log.debug('getOrderLines - queryPartyIdStr: ');
    log.debug(queryPartyIdStr);

    const queryPartyId = queryPartyIdStr
      ? JSON.parse(queryPartyIdStr)
      : undefined;

    log.debug('getOrderLines - queryPartyId: ');
    log.debug(queryPartyId);

    if (
      (userFlow === USER_FLOW.DEFAULT &&
        (queryPartyId === undefined || queryPartyId === null)) ||
      orderId === undefined ||
      orderId === null
    ) {
      const errorEvent = new ErrorEvent(404, false, '404', 'Not Found');
      return constructor.getResponse(404, errorEvent.getPayloadStr(), {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: jwtToken
      });
    }

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getOrderLines(
        cochlearId,
        orderId
      );

      log.debug('getOrderLines, pmGetOrderLines: - mockedResponse');
      log.debug(mockedResponse);

      const data = constructor.getDataObj({
        orderLines: mockedResponse.data.orderLines
      });
      const response = constructor.getResponse(200, JSON.stringify(data), {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: jwtToken
      });
      return response;
    }

    const ordersController = new OrdersController(userFlow, configuration);

    const orderLines = await ordersController.getOrderDetails({
      orderId,
      id: userFlow === USER_FLOW.DEFAULT ? queryPartyId : cochlearId,
      sub,
      filterItems,
      countryCode
    });

    log.debug('getOrderLines - orderLines: ');
    log.debug(orderLines);

    if (orderLines.length === 0) {
      const errorEvent = new ErrorEvent(404, false, '404', 'Not Found');
      return constructor.getResponse(404, errorEvent.getPayloadStr(), {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: jwtToken
      });
    }

    const data = constructor.getDataObj(orderLines);
    const response = constructor.getResponse(200, JSON.stringify(data), {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: jwtToken
    });
    return response;
  } catch (error) {
    logError(error);
  }

  const errorEvent = new ErrorEvent(500, false, '500', 'Internal Server Error');
  return constructor.getResponse(500, errorEvent.getPayloadStr(), {
    'Access-Control-Expose-Headers':
      'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
    Authorization: jwtToken
  });
}

module.exports = {
  getOrderHeaders,
  getOrderLines
};
