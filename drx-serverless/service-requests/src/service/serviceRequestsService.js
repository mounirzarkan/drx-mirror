'use strict';

const {log} = require('../util/index.js');
const connectors = require('../connector/index.js');
const conversion = require('../conversion/index.js');

class ServiceRequestsService {
  constructor(config) {
    this.config = config;
  }

  async retrieveServiceRequests(cochlearId, page, accessToken) {
    const {BOOMIConnector} = connectors;
    const {BOOMIServiceRequestsConversion} = conversion;

    const boomiConnector = new BOOMIConnector(this.config, accessToken);
    const boomiConverter = new BOOMIServiceRequestsConversion();

    const data = await boomiConnector.getServiceRequests(cochlearId, page);
    log.debug('ServiceRequestsService, retrieveServiceRequests: - boomi data');
    log.debug(data);

    const serviceRequests = boomiConverter.convertServiceRequests(data);
    log.debug(
      'ServiceRequestsService, retrieveServiceRequests: - serviceRequests'
    );
    log.debug(serviceRequests);

    return serviceRequests;
  }

  async retrieveServiceRequest(cochlearId, serviceRequestId, accessToken) {
    const {BOOMIConnector} = connectors;
    const {BOOMIServiceRequestsConversion} = conversion;

    const boomiConnector = new BOOMIConnector(this.config, accessToken);
    const boomiConverter = new BOOMIServiceRequestsConversion();

    const data = await boomiConnector.getServiceRequest(
      cochlearId,
      serviceRequestId
    );
    log.debug('ServiceRequestsService, retrieveServiceRequest: - boomi data');
    log.debug(data);

    const serviceRequest = boomiConverter.convertServiceRequest(data);
    log.debug(
      'ServiceRequestsService, retrieveServiceRequest: - serviceRequest'
    );
    log.debug(serviceRequest);

    return serviceRequest;
  }

  async raiseServiceRequest(payload, cochlearId, accessToken) {
    log.debug('ServiceRequestsService, raiseServiceRequest: - payload');
    log.debug(payload);

    log.debug('ServiceRequestsService, raiseServiceRequest: - cochlearId');
    log.debug(cochlearId);

    const {BOOMIConnector} = connectors;
    const {BOOMIServiceRequestsConversion} = conversion;

    const boomiConnector = new BOOMIConnector(this.config, accessToken);
    const boomiConverter = new BOOMIServiceRequestsConversion();

    const serviceRequest = boomiConverter.convertCreateCase(
      payload,
      cochlearId
    );
    log.debug('ServiceRequestsService, raiseServiceRquest: - serviceRequest');
    log.debug(serviceRequest);

    const data = await boomiConnector.createCase(serviceRequest, cochlearId);
    log.debug('ServiceRequestsService, raiseServiceRequest: - boomi data');
    log.debug(data);

    return data;
  }
}

module.exports = ServiceRequestsService;
