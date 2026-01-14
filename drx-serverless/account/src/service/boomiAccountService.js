'use strict';
const {log} = require('../util/index');
const connectors = require('../connector/index');
const {sageResponseMapper, sagePayloadMapper} = require('../mapper/index');
const {BoomiSubjectRelation} = require('../relation/index');
const SFAccountService = require('./sfAccountService');
const ACCESS_TOKEN_PREFIX = 'drxAccessTokenPrefix_';

class BoomiAccountService {
  constructor(config) {
    log.debug('BoomiAccountService, constructor - ');
    log.debug(config);

    this.config = config;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
  }

  async patchAccount(payload, context, obj) {
    log.debug('BoomiAccountService, patchAccount - ');
    log.debug(payload);

    const includesPhone = payload.request?.account?.phones ? true : false;
    log.debug('BoomiAccountService, includesPhone - ');
    log.debug(includesPhone);

    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + context.sub
    );

    log.debug('BoomiAccountService, user accessToken:');
    log.debug(accessToken);

    const {BOOMIConnector} = connectors;
    const booomiAccountConnector = new BOOMIConnector(this.config, accessToken);

    const {customerIdentifier, modifiedByApp, account} = payload.request;
    const convertedAccount = sagePayloadMapper.accountToSagePayload(
      context.countryCode,
      account
    );

    log.debug('BoomiAccountService, patchAccount - : convertedAccount');
    log.debug(convertedAccount);

    //obj is id query param
    //sub is requestor
    if (context.sub != context.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(context, booomiAccountConnector);
      if (
        !boomiSubjectRelationSub.isPermittedToViewEditAccountDetails(
          context.obj,
          boomiSubjectRelationObj
        ) ||
        (includesPhone &&
          !boomiSubjectRelationSub.isPermittedToViewEditPhoneDetails(
            context.obj,
            boomiSubjectRelationObj
          ))
      ) {
        log.debug('Carer/Recipient operation not allowed');
        throw new Error('451');
      }
    }

    const sagePayload = {
      patient: {
        cochlearId: customerIdentifier,
        ...convertedAccount,
        metadata: {
          modifiedBy: context.modifiedBy,
          channel: modifiedByApp,
          changeOrigin: `${modifiedByApp}:UpdatePatient`
        }
      }
    };
    log.debug('BoomiAccountService, patchAccount - : sagePayload');
    log.debug(sagePayload);

    const patchResp = await booomiAccountConnector.updateAccount(
      obj,
      sagePayload
    );

    log.debug('BoomiAccountService, patchAccount - : patchResp');
    log.debug(patchResp);

    if (account.phones?.mobile?.ocSms && context.countryCode === 'US') {
      const sageConsentPayload = {
        patientoperationalconsent: {
          cochlearId: customerIdentifier,
          status: account.phones?.mobile.ocSms,
          metadata: {
            modifiedBy: context.modifiedBy,
            channel: modifiedByApp,
            changeOrigin: `${modifiedByApp}:UpdatePatient`
          }
        }
      };
      log.debug(
        'BoomiAccountService, patchAccountConsent - : sageConsentPayload'
      );
      log.debug(sageConsentPayload);
      const patchConsentResp =
        await booomiAccountConnector.updateAccountConsent(
          obj,
          sageConsentPayload
        );
      log.debug(
        'BoomiAccountService, patchAccountConsent - : patchConsentResp'
      );
      log.debug(patchConsentResp);
    }

    return patchResp;
  }

  async getAccount(params) {
    log.debug('BoomiAccountService, getAccount - ');
    log.debug(params);

    const userType = params.sub_userType;
    log.debug('BoomiAccountService, userType - ');
    log.debug(userType);

    const accessToken = await this.cache.getCustomKeyCache(
      this.userSessionPrefix,
      ACCESS_TOKEN_PREFIX + params.sub
    );

    log.debug('BoomiAccountService, user accessToken:');
    log.debug(accessToken);

    const {BOOMIConnector} = connectors;
    const booomiAccountConnector = new BOOMIConnector(this.config, accessToken);

    const dataAccountPromise = booomiAccountConnector.getPatient(params.obj);
    const dataAccountConsentPromise = booomiAccountConnector.getAccountConsent(
      params.obj
    );
    const patientOrganizationRelationshipPromise =
      booomiAccountConnector.getPatientOrganizationRelationship(params.obj);

    const [dataAccount, dataAccountConsent, patientOrganizationRelationship] =
      await Promise.all([
        dataAccountPromise,
        dataAccountConsentPromise,
        patientOrganizationRelationshipPromise
      ]);

    const account = sageResponseMapper.sageResponseToAccount(
      dataAccount,
      dataAccountConsent,
      patientOrganizationRelationship,
      userType
    );
    if (params.sub != params.obj) {
      const [boomiSubjectRelationSub, boomiSubjectRelationObj] =
        await this._checkPatientRelation(params, booomiAccountConnector);
      if (
        !boomiSubjectRelationSub.isPermittedToViewEditAccountDetails(
          params.obj,
          boomiSubjectRelationObj
        )
      ) {
        return {};
      }
      if (
        !boomiSubjectRelationSub.isPermittedToViewEditPhoneDetails(
          params.obj,
          boomiSubjectRelationObj
        )
      ) {
        account.phones = {};
        account.email = '';
      }
    }

    const patientRelationship =
      await booomiAccountConnector.getPatientRelationship(params.obj);
    const patientRelationshipDependent =
      await booomiAccountConnector.getPatientRelationshipDependent(params.obj);
    const boomiSubjectRelation = new BoomiSubjectRelation(dataAccount.personas);
    boomiSubjectRelation.setCarerRelations(patientRelationship);
    boomiSubjectRelation.setPatientRelations(patientRelationshipDependent);
    Object.assign(
      account,
      boomiSubjectRelation.hasCarers && {
        relatedCarers: boomiSubjectRelation.getRelatedCarers()
      }
    );

    if (userType === 'Carer') {
      Object.assign(
        account,
        boomiSubjectRelation.hasRecipients && {
          relatedRecipients: boomiSubjectRelation.getRelatedRecipients()
        }
      );
    }

    log.debug('BoomiAccountService, booomiAccountConnector: - returnBoomiJSON');
    log.debug({account});

    return {account};
  }

  async getUserIdentity(params) {
    // TODO - getting identity from SF for now
    return await new SFAccountService(this.config).getUserIdentity(params);
  }

  async _checkPatientRelation(params, booomiAccountConnector) {
    console.time('BOOMI-account-_checkPatientRelation');

    const dataAccountSubPromise = booomiAccountConnector.getPatient(params.sub);
    const patientRelationshipSubPromise =
      booomiAccountConnector.getPatientRelationship(params.sub);
    const patientRelationshipSubDependentPromise =
      booomiAccountConnector.getPatientRelationshipDependent(params.sub);

    const dataAccountObjPromise = booomiAccountConnector.getPatient(params.obj);
    const patientRelationshipObjPromise =
      booomiAccountConnector.getPatientRelationship(params.obj);
    const patientRelationshipObjDependentPromise =
      booomiAccountConnector.getPatientRelationshipDependent(params.obj);

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

    console.timeEnd('BOOMI-account-_checkPatientRelation');

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

module.exports = BoomiAccountService;
