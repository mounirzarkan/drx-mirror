'use strict';

const controllers = require('./controller/index.js');
const { isEmpty, isEqual } = require('lodash');

const {
  log,
  utils,
  getUserFlow,
  USER_FLOW,
  getConfig,
  CONFIG_PROFILE
} = require('./util/index.js');
const { PMConnector } = require('./connector/index.js');
const constructor = require('./constructor/responsePayloadConstructor.js');
const configurations = require('./configuration/index.js');
const simulations = require('./simulation/index.js');

async function getServiceRequests(event, reqContext) {
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const { ServiceRequestsController } = controllers;
    const { EnvironmentConfiguration } = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const context = {};
    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;
    context.page = event.queryStringParameters.page || 1;

    const sortParams = {
      sortField: event.queryStringParameters?.sortField,
      sortOrder: event.queryStringParameters?.sortOrder
    };

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
        'getServiceRequests'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getServiceRequests(context.obj);
      log.debug('getServiceRequests, pmGetServiceRequests: - mockedResponse');
      log.debug(mockedResponse);

      const returnStr = JSON.stringify({
        success: true,
        data: {
          serviceRequests: mockedResponse.data.serviceRequests
        }
      });

      const response = constructor.getResponse(200, returnStr, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
      return response;
    }

    const serviceRequestsController = new ServiceRequestsController(
      configuration
    );
    let serviceRequests =
      await serviceRequestsController.retrieveServiceRequests(context);

    if (sortParams.sortField) {
      log.debug('getServiceRequests sortParms');
      log.debug(sortParams);

      const requestList = utils.sortList(
        serviceRequests.requestList,
        sortParams
      );

      serviceRequests = {
        ...serviceRequests,
        requestList: requestList
      };

      log.debug('getServiceRequests sorted serviceRequests');
      log.debug(serviceRequests);
    }

    const returnStr = JSON.stringify({
      success: true,
      data: serviceRequests
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

    log.error('error caught getServiceRequests: ');
    log.error(err);
    let statusCode = '500';
    let title = 'Internal Server Error';
    let errorCode = '500';
    let detail = 'Internal Server Error';

    if (isEqual('403', err.message)) {
      statusCode = 403;
      title = 'Not Authorized to query';
      errorCode = '403';
      detail = 'Not Authorized to query';
    }

    const body = JSON.stringify(
      constructor.getErrorResponse(false, title, errorCode, detail)
    );
    return constructor.getResponse(statusCode, body, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}

async function getServiceRequest(event, reqContext) {
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const { ServiceRequestsController } = controllers;
    const { EnvironmentConfiguration } = configurations;
    const configuration = new EnvironmentConfiguration(process.env);

    const context = {};
    context.serviceRequestId = event.pathParameters.serviceRequestId;

    const isValidPathParameter = utils.isValidPathParameter(
      context.serviceRequestId
    );

    if (!isValidPathParameter) {
      const statusCode = '400';
      const title = 'Bad Request';
      const errorCode = '400';
      const detail = 'Bad Request';

      const body = JSON.stringify(
        constructor.getErrorResponse(false, title, errorCode, detail)
      );
      return constructor.getResponse(statusCode, body, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
    }

    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;
    context.page = event.queryStringParameters.page || 1;
    context.sortParams = {
      sortField: event.queryStringParameters?.sortField,
      sortOrder: event.queryStringParameters?.sortOrder
    };

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
        'getServiceRequest'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getServiceRequests(context.obj);
      log.debug('getServiceRequests, pmGetServiceRequests: - mockedResponse');
      log.debug(mockedResponse);

      const returnStr = JSON.stringify({
        success: true,
        data: {
          serviceRequests: mockedResponse.data.serviceRequests
        }
      });

      const response = constructor.getResponse(200, returnStr, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
      return response;
    }

    const serviceRequestsController = new ServiceRequestsController(
      configuration
    );
    
    const serviceRequests =
      await serviceRequestsController.retrieveServiceRequest(context);

    const returnStr = JSON.stringify({
      success: true,
      data: serviceRequests
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

    log.error('error caught getServiceRequest: ');
    log.error(err);
    let statusCode = '500';
    let title = 'Internal Server Error';
    let errorCode = '500';
    let detail = 'Internal Server Error';

    if (isEqual('403', err.message)) {
      statusCode = 403;
      title = 'Not Authorized to query';
      errorCode = '403';
      detail = 'Not Authorized to query';
    }

    const body = JSON.stringify(
      constructor.getErrorResponse(false, title, errorCode, detail)
    );
    return constructor.getResponse(statusCode, body, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}

async function raiseServiceRequest(event, reqContext) {
  try {
    log.debug('debug event: ');
    log.debug(event);
    log.debug('debug reqContext: ');
    log.debug(reqContext);

    const { ServiceRequestsController } = controllers;
    const { EnvironmentConfiguration } = configurations;
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

    context.sub = event.requestContext.authorizer.sub;
    context.sub_userType = event.requestContext.authorizer.userType;
    context.obj = event.requestContext.authorizer.obj;
    context.countryCode = event.requestContext.authorizer.countryCode;

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
        'getServiceRequest'
      );
    }

    const userFlow = await getUserFlow(
      appConfig,
      context.obj,
      context.countryCode
    );

    if (userFlow === USER_FLOW.LAMBDA_MOCK) {
      const pmConnector = new PMConnector(configuration);
      const mockedResponse = await pmConnector.getServiceRequests(context.obj);
      log.debug('getServiceRequests, pmGetServiceRequests: - mockedResponse');
      log.debug(mockedResponse);

      const returnStr = JSON.stringify({
        success: true,
        data: {
          serviceRequests: mockedResponse.data.serviceRequests
        }
      });

      const response = constructor.getResponse(200, returnStr, {
        'Access-Control-Expose-Headers':
          'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
        Authorization: event.requestContext.authorizer.jwtToken
      });
      return response;
    }

    const serviceRequestsController = new ServiceRequestsController(
      configuration
    );

    await serviceRequestsController.raiseServiceRequest(payloadJson, context);

    const returnStr = JSON.stringify({
      success: true,
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

    log.error('error caught raiseServiceRequest: ');
    log.error(err);
    let statusCode = '500';
    let title = 'Internal Server Error';
    let errorCode = '500';
    let detail = 'Internal Server Error';

    if (isEqual('403', err.message)) {
      statusCode = 403;
      title = 'Not Authorized to query';
      errorCode = '403';
      detail = 'Not Authorized to query';
    }

    const body = JSON.stringify(
      constructor.getErrorResponse(false, title, errorCode, detail)
    );
    return constructor.getResponse(statusCode, body, {
      'Access-Control-Expose-Headers':
        'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers',
      Authorization: event.requestContext.authorizer.jwtToken
    });
  }
}


module.exports = {
  getServiceRequests,
  getServiceRequest,
  raiseServiceRequest
};
