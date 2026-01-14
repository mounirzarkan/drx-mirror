'use strict';

const {log, constructDescription} = require('../util/index.js');

class BOOMIServiceRequestsConversion {
  constructor() {}

  convertServiceRequests(data) {
    const response = {};

    log.debug('BOOMIServiceRequestsConversion, convertServiceRequests: - data');
    log.debug(data);

    if (data) {
      response.requestList = data.patientServiceRequests?.map((request) => {
        return {
          type: request.asset?.device?.product?.type,
          partNumber: request.asset?.device?.product?.partNumber,
          name: request.asset?.device?.product?.name,
          id: request.id,
          serviceRequestNumber: request.serviceRequestNumber,
          status: request.status,
          createdDate: request.createdDate
        };
      });
    }

    log.debug(
      'BOOMIServiceRequestsConversion, convertServiceRequests: - response'
    );
    log.debug(response);

    return response;
  }

  convertServiceRequest(data) {
    const response = {};

    log.debug('BOOMIServiceRequestConversion, convertServiceRequest: - data');
    log.debug(data);

    if (data) {
      response.requestDetails = {
        id: data.id,
        serviceRequestNumber: data.serviceRequestNumber,
        name: data.asset?.device?.product?.name || '',
        type: data.asset?.device?.product?.type || '',
        status: data.status || 'Unknown',
        createdDate: data.createdDate,
        clinic: data.provider?.name || '',
        partNumber: data.asset?.device?.product?.partNumber || '',
        activated: data.asset?.startDate,
        warranty: data.activeWarranty,
        problem: {
          code: data.problemCode || 'Unknown',
          description: data.problemDescription || '',
          details: data.problemDetails || ''
        }
      };
      response.shippingDetails = {
        shippedTo: data.shippingContact,
        address: data.shippingAddress
      };
    }

    log.debug(
      'BOOMIServiceRequestsConversion, convertServiceRequest: - response'
    );
    log.debug(response);

    return response;
  }

  convertCreateCase(data) {
    let response = {};

    log.debug('BOOMIServiceRequestConversion, convertCreateCase: - data');
    log.debug(data);

    if (data) {
      const description = constructDescription(data);
      log.debug(
        'BOOMIServiceRequestConversion, convertServiceRequest: - description'
      );
      log.debug(description);

      response = {
        subject: `${data.firstName} ${data.lastName} - DRX Service Request - ${data.deviceType}`,
        description,
        webReason: 'Service Request',
        caseType: 'Internal Interaction',
        metadata: {
          modifiedBy: `${data.firstName} ${data.lastName}`,
          channel: 'DRX'
        }
      };
    }

    log.debug('BOOMIServiceRequestsConversion, convertCreateCase: - response');
    log.debug(response);

    return response;
  }
}

module.exports = BOOMIServiceRequestsConversion;
