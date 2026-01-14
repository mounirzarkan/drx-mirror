'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {AccountController} = require('../../../src/controller/index.js');
const {cryptography, USER_FLOW} = require('../../../src/util/index.js');

describe('SUITE: AccountController', () => {
  let accountController;
  const userFlow = USER_FLOW.DEFAULT;
  const configStr = JSON.stringify({
    scEndpoint: 'scEndpoint',
    sfHostname: 'sfHostname',
    sfClientId: 'sfClientId',
    sfUserName: 'sfUserName',
    secret: {
      scp_env_username: 'scp_env_username',
      scp_env_password: 'scp_env_password',
      sc_apikey: 'sc_apikey'
    },
    _env: 'DEV',
    privacyRulesSeconds: 7200,
    userSessionSeconds: 7200,
    userSessionPrefix: 'drx-dev-'
    // cacheRepo: {get: function() {}, save: function() {}},
  });

  const getAddressContextStr = JSON.stringify({
    obj: '198835944744967',
    sub: '198835944744967',
    sub_userType: 'Recipient',
    countryCode: 'us'
  });
  const patchAddressContextStr = JSON.stringify({
    modifiedBy: 'Andrew Schultz',
    sub: '198835944744967',
    userType: 'Recipient'
  });
  const accountWithPermissionStr = JSON.stringify({
    _metadata: {readOnlyForm: false},
    firstName: {value: 'Ivan 3', permission: 'rw'},
    lastName: {value: 'Vasquez 2', permission: 'rw'},
    email: {value: 'unapa@cochlear.com', permission: 'rw'},
    dateOfBirth: {value: '2015-04-03', permission: 'rw'},
    familyConsent: {value: 'Withdrawn', permission: 'r'},
    phones: {
      value: [
        {
          type: 'Mobile',
          phoneNumber: '+1111111',
          isValid: true,
          isPrimary: true,
          ocSms: null
        }
      ],
      permission: 'rw'
    }
  });
  const patchPersonalChangePayloadStr = JSON.stringify({
    request: {
      customerIdentifier:
        'b2a724f7ce7697a5ceda25ba5d74bf00a7635d8851e48364a0ac979da807098f0EBYnUCPCU%2FXifGmCU8Cgg%3D%3D1361edb30601f4f8c5cf7ac1581a9497157fc322c154d1da9cd1584f56404174',
      modifiedByApp: 'drx',
      account: {
        firstName: 'Andrew',
        lastName: 'Schultz',
        dateOfBirth: '1993-08-11'
      }
    }
  });
  const decryptedCustomerIdentifierStr = '198835944744967';
  beforeEach(() => {
    const config = JSON.parse(configStr);
    accountController = new AccountController(userFlow, config);
  });
  it('CASE : getAccount returns account with permissions object', async () => {
    // sinon
    //   .stub(accountController.cacheKeyService, 'getCustomKey')
    //   .returns(
    //     'userSessionKey drx-dev-account-getAccount-198835944744967-198835944744967'
    //   );
    sinon.stub(accountController, 'getFromCache').returns(undefined);
    sinon
      .stub(accountController.accountService, 'getAccount')
      .resolves(JSON.parse(accountWithPermissionStr));
    sinon.stub(accountController, 'saveInCache').returns(undefined);

    const result = await accountController.getAccount(
      JSON.parse(configStr),
      JSON.parse(getAddressContextStr)
    );
    expect(result).to.deep.equal(JSON.parse(accountWithPermissionStr));
  });

  it('CASE : patchAccount returns status property equal to 200', async () => {
    const payload = JSON.parse(patchPersonalChangePayloadStr);
    sinon.stub(cryptography, 'decrypt').returns(decryptedCustomerIdentifierStr);
    sinon.stub(accountController, 'getAccount').returns({});
    // sinon
    //   .stub(accountController.cacheKeyService, 'getCustomKey')
    //   .withArgs('drx-dev-', 'cacheUserInfo-198835944744967')
    //   .returns('userInfoSessionKey drx-dev-cacheUserInfo-198835944744967')
    //   .withArgs(
    //     'drx-dev-',
    //     'account-getAccount-198835944744967-198835944744967'
    //   )
    //   .returns('drx-dev-account-getAccount-198835944744967-198835944744967')
    //   .withArgs('drx-dev-', 'getProfile-198835944744967')
    //   .returns('drx-dev-getProfile-198835944744967');
    sinon
      .stub(accountController.accountService, 'patchAccount')
      .returns({status: 200});
    sinon.stub(accountController, 'removeCacheEntry').returns(undefined);
    const result = await accountController.patchAccount(
      payload,
      JSON.parse(patchAddressContextStr)
    );
    expect(result).with.property('status').to.equal(200);
  });

  afterEach(() => {
    sinon.restore();
  });
});
