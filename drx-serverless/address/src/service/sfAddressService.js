'use strict';

const {log} = require('../util/index.js');

const connectors = require('../connector/index.js');
const {SFIntegrationToken} = require('../token/index.js');
const {sfMapper} = require('../mapper/index.js');
const {SFSubjectRelation} = require('../relation/index.js');

class SFAddressService {
  constructor(config) {
    this.encryptKey = config.encryptKey;
    this.sfIntegrationToken = new SFIntegrationToken(config);
  }

  async retrieveAddress(params) {
    const token = await this.sfIntegrationToken.getCacheToken();

    log.debug('SFAddressService, retrieveAddress - : token');
    log.debug(token);

    const {SFConnector} = connectors;

    const sfConnector = new SFConnector(token);

    const relationshipInfo = await sfConnector.getRelationship(params.obj);

    log.debug('SFAddressService, retrieveAddress - : relationshipInfo');
    log.debug(relationshipInfo);

    const subjectRelation = new SFSubjectRelation(
      params.sub,
      params.sub_userType,
      params.countryCode
    );
    subjectRelation.setRelation(params.obj, relationshipInfo);

    log.debug('SFAddressService, retrieveAddress - : subjectRelation');
    log.debug(subjectRelation);

    const sfAddress = await sfConnector.getAddress(params.obj);

    log.debug('SFAddressService, retrieveAddress - : sfAddress');
    log.debug(sfAddress);

    const addressJson = sfMapper.sfAddressMapper(sfAddress);

    return addressJson;
  }

  async updateAddress(request, context, obj) {
    const tokenPromise = this.sfIntegrationToken.getCacheToken();
    const convertedAddress = sfMapper.sfAddressMapper({items: [request]});
    convertedAddress.isCurrentResidence = true;
    convertedAddress.customerIdentifier = obj;
    const sfPayload = {
      request: {
        modifiedByApp: request.modifiedByApp,
        modifiedBy: context.modifiedBy,
        address: convertedAddress
      }
    };

    const {SFConnector} = connectors;
    const token = await tokenPromise;

    log.debug('SFAddressService, updateAddress - : token');
    log.debug(token);

    const sfConnector = new SFConnector(token);
    const resp = await sfConnector.postAddress(sfPayload);

    log.debug('SFAddressService, updateAddress - : resp');
    log.debug(resp);

    return resp;
  }

  async readAddress(params) {
    log.debug(params);
    throw new Error('Read single address not implemented for SF');
  }

  async patchAddress(params) {
    log.debug(params);
    throw new Error('patch address not implemented for SF');
  }
}

module.exports = SFAddressService;
