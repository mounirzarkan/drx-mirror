'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {SFAccountService} = require('../../../src/service/index.js');
const {cryptography} = require('../../../src/util/index.js');
const connectors = require('../../../src/connector/index.js');
const {debug} = require('../../../src/util/logUtil.js');
describe('SUITE: SFAccountService - Unit Integration Test', () => {
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

  const tokenStr = JSON.stringify({
    hostname: '_hostname',
    clientSecret: '_secret.clientSecret',
    clientId: '_clientId',
    username: '_userName',
    password: '_secret.password',
    secretToken: '_secret.secret',
    instanceUrl: 'this.jsConnection.instanceUrl',
    accessToken: 'this.jsConnection.accessToken'
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

  const contextStr = JSON.stringify({
    modifiedBy: 'Andrew Schultz',
    sub: '198835944744967',
    userType: 'Recipient'
  });

  const patchPhoneChangePayloadStr = JSON.stringify({
    request: {
      customerIdentifier:
        'b2a724f7ce7697a5ceda25ba5d74bf00a7635d8851e48364a0ac979da807098f0EBYnUCPCU%2FXifGmCU8Cgg%3D%3D1361edb30601f4f8c5cf7ac1581a9497157fc322c154d1da9cd1584f56404174',
      modifiedByApp: 'drx',
      account: {
        phones: [
          {
            type: 'Mobile',
            phoneNumber: '111111111',
            ocSms: 'Given',
            isValid: true,
            isPrimary: false,
            country: '+1',
            areaCodeAndNumber: '1222'
          }
        ]
      }
    }
  });

  const decryptedCustomerIdentifierStr = '198835944744967';

  describe('patchAccount flow', () => {
    let accountService = undefined;

    beforeEach(() => {
      const config = JSON.parse(configStr);

      accountService = new SFAccountService(config);
    });

    it('CASE: when personal details are successfully modified, patchAccount returns status 200', async () => {
      const payload = JSON.parse(patchPersonalChangePayloadStr);
      const context = JSON.parse(contextStr);
      const obj = decryptedCustomerIdentifierStr;

      sinon.stub(connectors, 'SFConnector').returns(
        new (class {
          constructor() {}
          patchAccount() {
            return {status: 200};
          }
        })()
      );

      sinon
        .stub(accountService.sfIntegrationToken, 'getCacheToken')
        .resolves(JSON.parse(tokenStr));

      sinon
        .stub(cryptography, 'decrypt')
        .returns(decryptedCustomerIdentifierStr);

      const resp = await accountService.patchAccount(payload, context, obj);

      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: when phone details are successfully modified, patchAccount returns status 200', async () => {
      const payload = JSON.parse(patchPhoneChangePayloadStr);
      const context = JSON.parse(contextStr);
      const obj = '198835944744967';

      sinon.stub(connectors, 'SFConnector').returns(
        new (class {
          constructor() {}
          async patchAccount() {
            return {status: 200};
          }
        })()
      );

      sinon
        .stub(accountService.sfIntegrationToken, 'getCacheToken')
        .resolves(JSON.parse(tokenStr));

      sinon
        .stub(cryptography, 'decrypt')
        .returns(decryptedCustomerIdentifierStr);

      const resp = await accountService.patchAccount(payload, context, obj);

      expect(resp).with.property('status').to.equal(200);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: getAccount flow', () => {
    let accountService = undefined;
    const sfRelationshipStr = JSON.stringify({
      RelatedAccounts: [
        {
          RelationshipType: 'PARENT',
          RecordType: 'Recipient',
          LastName: 'Ward',
          IsCIMEnabled: true,
          FirstName: 'CarerLastName',
          CochlearId: '162748173278165'
        },
        {
          RelationshipType: 'SPOUSE',
          RecordType: 'Requester',
          LastName: 'CarerLastName',
          IsCIMEnabled: true,
          FirstName: 'CarerFirstName',
          CochlearId: '182512471537556'
        }
      ],
      RecordType: 'Recipient',
      LastName: 'LastName',
      IsCIMEnabled: true,
      FirstName: 'FirstName',
      DateOfBirth: 686188800000,
      CochlearId: '162748173278165'
    });

    const sfResponseAccountsStr = JSON.stringify({
      accounts: [
        {
          phones: [
            {
              type: 'Mobile',
              phoneNumber: '+1111111',
              ocSms: null,
              note: null,
              isValid: true,
              isPrimary: true,
              isOCSmsGiven: false,
              isChanged: false,
              index: 1,
              displayLabel: 'Preferred',
              country: null,
              areaCodeAndNumber: null
            }
          ],
          partyId: '8269480',
          customerIdentifier: '190929924411564',
          account: {
            attributes: {
              type: 'Account'
            },
            PersonTitle: null,
            FirstName: 'Ivan 3',
            LastName: 'Vasquez 2',
            MiddleName: 'Middle 2',
            Suffix: 'II',
            Alternate_First_Name__pc: 'Matthew',
            Alternate_Last_Name__pc: 'Vasquez',
            Description: null,
            PersonEmail: 'unapa@cochlear.com',
            BillingCountry: 'United States',
            Date_of_Birth__pc: '2015-04-03',
            Date_of_Death__pc: null,
            Gender__pc: 'Male',
            AccountNumber: '4642010',
            Ear_Side_of_Latest_SP_1__c: null,
            Ear_Side_of_Latest_SP_2__c: 'Left',
            Latest_Product_for_SP_1__c: null,
            Latest_Product_for_SP_2__c: 'CP1000',
            Contract_First_Start_Date_1__c: null,
            Contract_First_Start_Date_2__c: '2018-04-18',
            Hearing_Loss_Type__c: null,
            Other_Type__c: null,
            Party_ID__c: '8269480',
            Privacy_Consent__pc: 'Withdrawn',
            Marketing_Consent__pc: 'Withdrawn',
            Marketing_Consent_Cochlear_Family__pc: 'Withdrawn',
            Clinic_Consent_MapLog__pc: 'Withdrawn',
            Name: 'Ivan 3 Middle 2 Vasquez 2 II',
            BillingPostalCode: '12345',
            BillingCity: 'SCHENECTADY',
            Patient_Id__pc: null
          }
        }
      ]
    });
    const sfResponseAccountv2sStr = JSON.stringify({
      workPhone: null,
      thirdPartyDataSharingConsent: null,
      termsOfUseConsent: 'Given',
      shippingAddress: {
        city: 'Cypress',
        country: 'United States',
        geocodeAccuracy: null,
        latitude: null,
        longitude: null,
        postalCode: '77433-1047',
        state: 'TX',
        street: '1138 12th Ave N Street 2'
      },
      serviceRequests: [],
      privacyConsent: 'Given',
      personMailingCountry: 'United States',
      marketingConsentCochlearFamily: null,
      marketingConsent: 'Given',
      lastName: 'Puterbaugh',
      homePhone: '+2222222',
      firstName: 'masked by logUtils',
      fax: null,
      email: 'adlam@cochlear.com',
      dateOfBirth: -356400000000,
      clinics: [
        {
          name: 'Dr Grayson Rodgers Hearing & Balance',
          lastModifiedDate: 1527292800000
        }
      ],
      billingCountry: 'United States'
    });

    const getAccountResultStr = JSON.stringify({
      account: {
        firstName: 'Ivan 3',
        lastName: 'Vasquez 2',
        email: 'unapa@cochlear.com',
        dateOfBirth: '2015-04-03',
        familyConsent: 'Withdrawn',
        clinic: 'Dr Grayson Rodgers Hearing & Balance',
        phones: [
          {
            type: 'Mobile',
            phoneNumber: '+1111111',
            isValid: true,
            isPrimary: true,
            ocSms: null
          }
        ],
        shippingAddress: {
          address1: '1138 12th Ave N Street 2',
          city: 'Cypress',
          state: 'TX',
          postcode: '77433-1047',
          country: 'United States'
        },
        relatedCarers: ['CarerFirstName CarerLastName'],
        userName: 'Some username'
      },
      identity: {
        firstName: 'Ivan 3',
        lastName: 'Vasquez 2',
        email: 'Some username',
        userType: 'Recipient'
      }
    });

    beforeEach(() => {
      const config = JSON.parse(configStr);
      accountService = new SFAccountService({
        ...config,
        cacheRepo: {get: function () {}, save: function () {}}
      });
    });

    it('CASE: when user requests their address, getAccount returns an object with account info and permissions ', async () => {
      const sub = '198835944744967';
      const obj = '198835944744967';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'SFConnector').returns(
        new (class {
          constructor() {}
          getRelationship() {
            return JSON.parse(sfRelationshipStr);
          }
          getAccount() {
            return JSON.parse(sfResponseAccountsStr);
          }
          getAccountV2() {
            return JSON.parse(sfResponseAccountv2sStr);
          }
          getIdentity() {
            return {
              FirstName: 'Ivan 3',
              LastName: 'Vasquez 2',
              CochlearUserName: 'Some username',
              CIMUserType: 'Recipient'
            };
          }
        })()
      );

      sinon
        .stub(accountService.sfIntegrationToken, 'getCacheToken')
        .resolves(JSON.parse(tokenStr));

      const result = await accountService.getAccount({
        sub,
        sub_userType,
        countryCode,
        obj
      });
      debug(result);

      const getAccountResult = JSON.parse(getAccountResultStr);
      getAccountResult.account.relatedRecipients = undefined;
      expect(result).to.deep.equal(getAccountResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
