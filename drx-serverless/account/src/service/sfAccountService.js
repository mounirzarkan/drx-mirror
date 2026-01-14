'use strict';
const {utils, log} = require('../util/index');

const {SFIntegrationToken} = require('../token/index');
const {sfPayloadMapper, sfResponseMapper} = require('../mapper/index');
const {SFSubjectRelation} = require('../relation/index');
const connectors = require('../connector/index');

class SFAccountService {
  constructor(config) {
    this.config = config;
    this.cache = config.cache;
    this.userSessionPrefix = config.userSessionPrefix;
    this.sfIntegrationToken = new SFIntegrationToken(this.config);
  }

  async patchAccount(payload, context, obj) {
    const tokenPromise = this.sfIntegrationToken.getCacheToken();
    const {customerIdentifier, modifiedByApp, account} = payload.request;

    const convertedAccount = sfPayloadMapper.accountToSfPayload(account);

    log.debug('SFAccountService, patchAccount - : convertedAccount');
    log.debug(convertedAccount);

    let phones = undefined;
    if (
      Array.isArray(convertedAccount.phones) &&
      convertedAccount.phones.length > 0
    ) {
      const includeOcSms = utils.includeOcSms(
        context.sub_userType,
        context.sub,
        obj
      );

      log.debug('SFAccountService, patchAccount - : includeOcSms');
      log.debug(includeOcSms);

      phones = sfPayloadMapper.phonesToSfPayload(
        convertedAccount.phones,
        includeOcSms
      );

      log.debug('SFAccountService, patchAccount - : phones');
      log.debug(phones);
    }
    convertedAccount.phones = undefined;
    const sfPayload = {
      request: {
        customerIdentifier: customerIdentifier,
        modifiedByApp,
        modifiedBy: context.modifiedBy,
        account: convertedAccount,
        phones
      }
    };

    log.debug('SFAccountService, patchAccount - : sfPayload');
    log.debug(sfPayload);

    const token = await tokenPromise;

    log.debug('SFAccountService, patchAccount - : token');
    log.debug(token);

    const {SFConnector} = connectors;
    const sfConnector = new SFConnector(token);
    const patchResp = await sfConnector.patchAccount(sfPayload);

    log.debug('SFAccountService, patchAccount - : patchResp');
    log.debug(patchResp);

    return patchResp;
  }

  async getAccount(params) {
    log.debug('SFAccountService, getAccount - ');
    log.debug(params);

    const token = await this.sfIntegrationToken.getCacheToken();

    log.debug('SFAccountService, getAccount - : token');
    log.debug(token);

    const {SFConnector} = connectors;
    const sfConnector = new SFConnector(token);
    const relationshipInfo = await sfConnector.getRelationship(params.obj);
    log.debug('SFAccountService, getAccount - : relationshipInfo');
    log.debug(relationshipInfo);

    const subjectRelation = new SFSubjectRelation(
      params.sub,
      params.sub_userType,
      params.countryCode
    );
    subjectRelation.setRelation(params.obj, relationshipInfo);

    log.debug('SFAccountService, getAccount - : subjectRelation');
    log.debug(subjectRelation);

    const [sfAccounts, sfIdentity] = await Promise.all([
      sfConnector.getAccount(params.obj),
      sfConnector.getIdentity(params.sub)
    ]);

    log.debug('SFAccountService, getAccount - : sfAccounts');
    log.debug(sfAccounts);

    log.debug('SFAccountService, getAccount - : sfIdentity');
    log.debug(sfIdentity);

    const accountJson = sfResponseMapper.sfResponseToAccount(
      sfAccounts.accounts[0]
    );

    log.debug('SFAccountService, getAccount - : accountJson');
    log.debug(accountJson);

    const identityJson = sfResponseMapper.sfResponseToIdentity(sfIdentity);

    log.debug('SFAccountService, getAccount - : identityJson');
    log.debug(identityJson);

    if (
      Array.isArray(accountJson.phones) &&
      !subjectRelation.isPhoneRestricted()
    ) {
      const isOcSmsRequired = subjectRelation.isOcSmsRequired();

      log.debug('SFAccountService, getAccount - : isOcSmsRequired');
      log.debug(isOcSmsRequired);

      accountJson.phones = sfResponseMapper.sfResponseToPhones(
        accountJson.phones,
        isOcSmsRequired
      );
      log.debug('SFAccountService, getAccount - : accountJson.phones');
      log.debug(accountJson.phones);
    } else {
      accountJson.phones = [];
    }

    const sfAccountv2 = await sfConnector.getAccountV2(params.obj);
    const accountv2 = sfResponseMapper.convertAccount(sfAccountv2);
    log.debug('accountv2');
    log.debug(accountv2);

    accountJson.clinic = accountv2.clinic;
    const identityResponse = await sfConnector.getIdentity(params.obj);
    accountJson.userName = identityResponse?.CochlearUserName;

    accountJson.shippingAddress = accountv2.shippingAddress;
    accountJson.relatedCarers = subjectRelation.getRelatedCarers();
    accountJson.relatedRecipients = subjectRelation.getRelatedRecipients();

    log.debug(accountJson);
    return {
      account: accountJson,
      identity: identityJson || {}
    };
  }

  async getUserIdentity(params) {
    log.debug('SFAccountService, getUserIdentity - ');
    log.debug(params);

    const token = await this.sfIntegrationToken.getCacheToken();

    log.debug('SFAccountService, getUserIdentity - : token');
    log.debug(token);

    const {SFConnector} = connectors;
    const sfConnector = new SFConnector(token);
    const sfIdentity = await sfConnector.getIdentity(params.sub);

    log.debug('SFAccountService, getUserIdentity - : sfIdentity');
    log.debug(sfIdentity);

    const identityJson = sfResponseMapper.sfResponseToIdentity(sfIdentity);

    log.debug('SFAccountService, getUserIdentity - : identityJson');
    log.debug(identityJson);

    return {
      identity: identityJson || {}
    };
  }
}

module.exports = SFAccountService;
