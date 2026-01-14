'use strict';

const { log } = require('../util/index.js');

const connectors = require('../connector/index.js');
const { sageResponseMapper } = require('../mapper/index');
const { BoomiSubjectRelation } = require('../relation/index');
const { sagePayloadMapper } = require('../mapper/index.js');

const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';

class BoomiAddressService {
  constructor(config) {
    log.debug('BoomiAddressService, constructor - ');
    log.debug(config);

    this.config = config;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
  }
  // address list
  async retrieveAddress(params) {
    log.debug('BoomiAddressService, retrieveAddress - ');
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + params.sub
    );

    log.debug('BoomiAddressService, user accessToken:');
    log.debug(accessToken);

    const { BOOMIConnector } = connectors;
    const booomiAddressConnector = new BOOMIConnector(this.config, accessToken);

    //obj is id query param?
    //sub is requestor?
    if (params.sub != params.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(params, booomiAddressConnector);

      if (
        !boomiSubjectRelationSub.isPermittedToViewEdit(
          params.obj,
          boomiSubjectRelationObj
        )
      ) {
        log.debug('Carer/Recipient operation not allowed');
        throw new Error('451');
      }
    }

    const dataAddresses = await booomiAddressConnector.getAddresses(params.obj);
    const address =
      sageResponseMapper.sageResponseAddressessMapper(dataAddresses);

    log.debug('BoomiAddressService, booomiAddressConnector: - returnBoomiJSON');
    log.debug(address);

    return address;
  }

  // address read - single address
  async readAddress(params) {
    log.debug('BoomiAddressService, readAddress - ');
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + params.sub
    );

    log.debug('BoomiAddressService, user accessToken:');
    log.debug(accessToken);

    const { BOOMIConnector } = connectors;
    const booomiAddressConnector = new BOOMIConnector(this.config, accessToken);

    //obj is id query param?
    //sub is requestor?
    if (params.sub != params.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(params, booomiAddressConnector);
      if (
        !boomiSubjectRelationSub.isPermittedToViewEdit(
          params.obj,
          boomiSubjectRelationObj
        )
      ) {
        log.debug('Carer/Recipient operation not allowed');
        throw new Error('451');
      }
    }

    const dataAddresses = await booomiAddressConnector.getAddress(
      params.obj,
      params.addressId
    );
    const address = sageResponseMapper.sageResponseAddressMapper(dataAddresses);

    log.debug('BoomiAddressService, booomiAddressConnector: - returnBoomiJSON');
    log.debug(address);

    return address;
  }

  async updateAddress(payload, context, obj) {
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + context.sub
    );

    log.debug('BoomiAddressService, user accessToken:');
    log.debug(accessToken);

    const { BOOMIConnector } = connectors;
    const booomiAddressConnector = new BOOMIConnector(this.config, accessToken);

    if (context.sub != context.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(context, booomiAddressConnector);
      if (
        !boomiSubjectRelationSub.isPermittedToViewEdit(
          context.obj,
          boomiSubjectRelationObj
        )
      ) {
        log.debug('Carer/Recipient operation not allowed');
        throw new Error('Carer/Recipient operation not allowed');
      }
    }

    const convertedAddress =
      sagePayloadMapper.sagePayloadAddressMapper(payload);
    const sagePayload = {
      address: {
        ...convertedAddress,
        metadata: {
          modifiedBy: context.modifiedBy,
          channel: payload.modifiedByApp ?? 'drx',
          changeOrigin: `${payload.modifiedByApp ?? 'drx'}:CreateAddress`
        }
      }
    };
    log.debug('sagePayload', sagePayload);
    const resp = await booomiAddressConnector.createAddress(obj, sagePayload);
    log.debug('BoomiAddressService, updateAddress - : resp');
    log.debug(resp);

    return resp;
  }

  async patchAddress(payload, context, obj) {
    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + context.sub
    );

    log.debug('BoomiAddressService, user accessToken:');
    log.debug(accessToken);

    const { BOOMIConnector } = connectors;
    const booomiAddressConnector = new BOOMIConnector(this.config, accessToken);

    if (context.sub != context.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(context, booomiAddressConnector);
      if (
        !boomiSubjectRelationSub.isPermittedToViewEdit(
          context.obj,
          boomiSubjectRelationObj
        )
      ) {
        log.debug('Carer/Recipient operation not allowed');
        const error = new Error('Carer/Recipient operation not allowed');
        error.statusCode = '451';
        throw error;
      }
    }

    const primaryTypes = sagePayloadMapper.generatePrimaryTypes(
      payload.isBilling,
      payload.isShipping,
      payload.isMailing
    );

    await this._checkTags(
      obj,
      context.addressId,
      primaryTypes,
      booomiAddressConnector
    );

    const sagePayload = {
      address: {
        primaryTypes,
        metadata: {
          modifiedBy: context.modifiedBy,
          channel: payload.modifiedByApp ?? 'drx',
          changeOrigin: `${payload.modifiedByApp ?? 'drx'}:PatchAddress`
        }
      }
    };
    log.debug('sagePayload', sagePayload);

    const resp = await booomiAddressConnector.patchAddress(
      obj,
      context.addressId,
      sagePayload
    );
    log.debug('BoomiAddressService, patchAddress - : resp');
    log.debug(resp);

    return resp;
  }

  // get all address
  // check if all tags exist across all addresses before doing a patch
  // else if not, throw an error
  async _checkTags(patientId, addressId, tagsToUpdate, booomiAddressConnector) {
    const addresses = await booomiAddressConnector.getAddresses(patientId);

    const primaryTypes = ['Shipping', 'Mailing', 'Billing'];
    let primaryTypesFound = [];
    log.debug(addresses.patientAddress);
    addresses.patientAddress.forEach(
      (x) =>
        x.primaryTypes &&
        x.id != addressId &&
        primaryTypesFound.push(...x.primaryTypes)
    );

    log.debug('primaryTypes found:', primaryTypesFound);
    primaryTypesFound.push(...tagsToUpdate);
    primaryTypesFound = [...new Set(primaryTypesFound)];

    let primaryTypeMissing = [];
    primaryTypeMissing = primaryTypes.filter(
      (x) => !primaryTypesFound.includes(x)
    );
    log.debug('primaryTypes missing:', primaryTypeMissing);

    if (primaryTypeMissing.length > 0) {
      log.debug(`Tags missing: ${primaryTypeMissing.join(', ')}`);
      const error = new Error(`Tags missing: ${primaryTypeMissing.join(', ')}`);
      error.statusCode = '409';
      throw error;
    }
  }

  async _checkPatientRelation(params, booomiAddressConnector) {
    console.time('BOOMI-address-_checkPatientRelation');
    const dataAccountSubPromise = booomiAddressConnector.getPatient(params.sub);
    const patientRelationshipSubPromise =
      booomiAddressConnector.getPatientRelationship(params.sub);
    const patientRelationshipSubDependentPromise =
      booomiAddressConnector.getPatientRelationshipDependent(params.sub);

    const dataAccountObjPromise = booomiAddressConnector.getPatient(params.obj);
    const patientRelationshipObjPromise =
      booomiAddressConnector.getPatientRelationship(params.obj);
    const patientRelationshipObjDependentPromise =
      booomiAddressConnector.getPatientRelationshipDependent(params.obj);

    const [
      dataAccountSub,
      patientRelationshipSub,
      patientRelationshipSubDependent,
      dataAccountObj,
      patientRelationshipObj,
      patientRelationshipObjDependent
    ] = await Promise.all([
      dataAccountSubPromise,
      patientRelationshipSubPromise,
      patientRelationshipSubDependentPromise,
      dataAccountObjPromise,
      patientRelationshipObjPromise,
      patientRelationshipObjDependentPromise
    ]);
    console.timeEnd('BOOMI-address-_checkPatientRelation');
    const boomiSubjectRelationSub = new BoomiSubjectRelation(
      dataAccountSub.personas
    );
    boomiSubjectRelationSub.setCarerRelations(patientRelationshipSub);
    boomiSubjectRelationSub.setPatientRelations(
      patientRelationshipSubDependent
    );

    const boomiSubjectRelationObj = new BoomiSubjectRelation(
      dataAccountObj.personas
    );
    boomiSubjectRelationObj.setCarerRelations(patientRelationshipObj);
    boomiSubjectRelationObj.setPatientRelations(
      patientRelationshipObjDependent
    );
    return [boomiSubjectRelationSub, boomiSubjectRelationObj];
  }
}

module.exports = BoomiAddressService;
