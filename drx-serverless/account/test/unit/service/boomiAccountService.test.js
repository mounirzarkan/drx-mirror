'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const { BoomiAccountService } = require('../../../src/service/index.js');
const connectors = require('../../../src/connector/index.js');
const { debug } = require('../../../src/util/logUtil.js');
const { sagePayloadMapper } = require('../../../src/mapper/index.js');
const BoomiSubjectRelation = require('../../../src/relation/BoomiSubjectRelation.js');

describe('SUITE: BoomiAccountService - Unit Integration Test', () => {
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

  describe('SUITE: getAccount flow', () => {
    let accountService = undefined;

    const boomiRelationshipStr = JSON.stringify({
      _meta: {
        totalRecords: 2,
        page: 1,
        limit: 10,
        count: 2
      },
      patientPatientList: [
        {
          patientPatient: {
            id: 'a0E6N00000Alg59UAB',
            cochlearId: '198005035636309',
            role: 'Carer'
          },
          relatedPatient: {
            cochlearId: '187509945837581',
            firstName: 'Latesha',
            lastName: 'Ingram',
            phone: '1111111111',
            email: 'emailxx438736z@mail.uu',
            isDeceased: false,
            isUnderAge: false
          }
        },
        {
          patientPatient: {
            id: 'a0E6N00000AmC1lUAF',
            cochlearId: '198005035636309',
            role: 'Carer'
          },
          relatedPatient: {
            cochlearId: '188632516720651',
            firstName: 'Latesha',
            lastName: 'Parr',
            phone: '5555707382',
            email: '383530@pacount.com',
            isDeceased: false,
            isUnderAge: false,
            shippingAddress: {
              street: ['BFXZ336680'],
              city: 'RIPLEY',
              state: 'TN',
              postalCode: '38063',
              stateCode: 'TN',
              country: 'United States',
              countryCode: 'US'
            }
          }
        }
      ]
    });

    const boomiResponseAccountsStr = JSON.stringify({
      cochlearId: '146668409866515',
      personas: ['Recipient'],
      firstName: 'TestName',
      lastName: 'Patel',
      middleName: 'mid',
      dateOfBirth: '1970-07-09',
      isDeceased: false,
      phone: '5555555555',
      mobile: '2351705',
      email: 'emailxx235190z@mail.uu',
      gender: 'Female',
      primaryCountryCode: 'US',
      isUnderAge: false,
      metadata: {
        createdTimestamp: '2020-12-22T13:39:35.000+0000'
      }
    });

    const getAccountResultStr = JSON.stringify({
      account: {
        dateOfBirth: '1970-07-09',
        email: 'emailxx235190z@mail.uu',
        firstName: 'TestName',
        isDeceased: false,
        lastName: 'Patel',
        personas: ['Recipient'],
        middleName: 'mid',
        clinic: 'Atlantic Rehab Institute',
        phones: {
          mobile: {
            callingCode: '',
            countryCode: 'US',
            number: '2351705',
            ocSms: 'Opt-In'
          },
          phone: {
            callingCode: '',
            countryCode: 'US',
            number: '5555555555'
          }
        },
        relatedCarers: [
          {
            cochlearId: '187509945837581',
            firstName: 'Latesha',
            lastName: 'Ingram'
          },
          {
            cochlearId: '188632516720651',
            firstName: 'Latesha',
            lastName: 'Parr'
          }
        ]
      }
    });

    const boomiAccountConsentStr = JSON.stringify({
      status: 'Opt-In',
      consentType: 'Informational',
      captureDate: '2024-05-08',
      captureSource: 'Automatic generated Consent',
      withdrawalReason: 'TOO_MANY_COMMUNICATIONS'
    });

    const patientOrganisationRelationship = {
      "_meta": {
        "totalRecords": 2,
        "page": 1,
        "limit": 10,
        "count": 2
      },
      "patientOrganisationList": [
        {
          "patientOrganisation": {
            "id": "07k6N00000ShNcUQAV",
            "cochlearId": "279727322322027",
            "roles": [
              "Provider"
            ]
          },
          "organisation": {
            "cochlearId": "256306926973687",
            "name": "Atlantic Rehab Institute",
            "organisationType": "Provider",
            "tradingName": "Atlantic Health",
            "phone": "1(973)9714401",
            "billingAddress": {
              "street": [
                "YTRM271763"
              ],
              "city": "CEDAR KNOLLS",
              "state": "NJ",
              "postalCode": "07927",
              "countryCode": "US",
              "stateCode": "NJ",
              "country": "United States"
            },
            "shippingAddress": {
              "street": [
                "BFXZ333948"
              ],
              "city": "CEDAR KNOLLS",
              "state": "NJ",
              "postalCode": "07927",
              "countryCode": "US",
              "stateCode": "NJ",
              "country": "United States"
            }
          }
        },
        {
          "patientOrganisation": {
            "id": "07k6N00000ShkbjQAB",
            "cochlearId": "279727322322027",
            "roles": [
              "Provider"
            ]
          },
          "organisation": {
            "cochlearId": "251474548971181",
            "name": "Overlook Medical Center Atlantic Health",
            "organisationType": "Provider",
            "tradingName": "Atlantic Health",
            "phone": "+1111111111",
            "billingAddress": {
              "street": [
                "YTRM77235"
              ],
              "city": "SUMMIT",
              "state": "NJ",
              "postalCode": "07902",
              "countryCode": "US",
              "stateCode": "NJ",
              "country": "United States"
            },
            "shippingAddress": {
              "street": [
                "BFXZ92903"
              ],
              "city": "NEW PROVIDENCE",
              "state": "NJ",
              "postalCode": "07974",
              "countryCode": "US",
              "stateCode": "NJ",
              "country": "United States"
            }
          }
        }
      ]
    };

    beforeEach(() => {
      const config = JSON.parse(configStr);
      accountService = new BoomiAccountService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });

    it('CASE: Requestor as recipient calls getAccount - returns an object with account info, personas, and patient patient relationship', async () => {
      const sub = '198835944744967';
      const obj = '198835944744967';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          // TODO ocSMS
          getAccountConsent() {
            return JSON.parse(boomiAccountConsentStr);
          }
          getToken() {
            return JSON.parse();
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatientRelationshipDependent() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatientOrganizationRelationship() {
            return patientOrganisationRelationship;
          }
        })()
      );

      const result = await accountService.getAccount({
        sub,
        sub_userType,
        countryCode,
        obj
      });
      debug(result);

      const getAccountResult = JSON.parse(getAccountResultStr);
      expect(result).to.deep.equal(getAccountResult);
    });

    it('CASE: Requestor as carer calls getAccount for patient - returns an object with account info, personas, and patient patient relationship', async () => {
      const sub = '198835944744967';
      const obj = '1234';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          // TODO ocSMS
          getAccountConsent() {
            return '';
          }
          getToken() {
            return JSON.parse();
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatientRelationshipDependent() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatientOrganizationRelationship() {
            return patientOrganisationRelationship;
          }
        })()
      );

      sinon
        .stub(
          BoomiSubjectRelation.prototype,
          'isPermittedToViewEditPhoneDetails'
        )
        .returns(false);

      sinon
        .stub(
          BoomiSubjectRelation.prototype,
          'isPermittedToViewEditAccountDetails'
        )
        .returns(true);

      const result = await accountService.getAccount({
        sub,
        sub_userType,
        countryCode,
        obj
      });

      const getAccountResult = JSON.parse(getAccountResultStr);
      getAccountResult.account.phones = {};
      getAccountResult.account.email = '';
      expect(result).to.deep.equal(getAccountResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: patchAccount flow', () => {
    let accountService = undefined;
    const boomiResponseAccountsStr = JSON.stringify({
      cochlearId: '146668409866515',
      personas: ['Carer'],
      firstName: 'TestName',
      lastName: 'Patel',
      middleName: 'mid',
      dateOfBirth: '1970-07-09',
      isDeceased: false,
      phone: '5555555555',
      mobile: '2351705',
      email: 'emailxx235190z@mail.uu',
      gender: 'Female',
      primaryCountryCode: 'US',
      isUnderAge: false,
      metadata: {
        createdTimestamp: '2020-12-22T13:39:35.000+0000'
      }
    });

    const boomiRelationshipStr = JSON.stringify({
      _meta: {
        totalRecords: 2,
        page: 1,
        limit: 10,
        count: 2
      },
      patientPatientList: [
        {
          patientPatient: {
            id: 'a0E6N00000Alg59UAB',
            cochlearId: '198005035636309',
            role: 'Carer'
          },
          relatedPatient: {
            cochlearId: '187509945837581',
            firstName: 'Latesha',
            lastName: 'Ingram',
            phone: '1111111111',
            email: 'emailxx438736z@mail.uu',
            isDeceased: false,
            isUnderAge: false
          }
        },
        {
          patientPatient: {
            id: 'a0E6N00000AmC1lUAF',
            cochlearId: '198005035636309',
            role: 'Carer'
          },
          relatedPatient: {
            cochlearId: '188632516720651',
            firstName: 'Latesha',
            lastName: 'Parr',
            phone: '5555707382',
            email: '383530@pacount.com',
            isDeceased: false,
            isUnderAge: false,
            shippingAddress: {
              street: ['BFXZ336680'],
              city: 'RIPLEY',
              state: 'TN',
              postalCode: '38063',
              stateCode: 'TN',
              country: 'United States',
              countryCode: 'US'
            }
          }
        }
      ]
    });
    const payload = {
      request: {
        modifiedByApp: 'drx',
        account: {
          phones: [
            {
              type: 'Home',
              phoneNumber: '+11632960891',
              ocSms: null,
              isValid: true,
              isPrimary: true,
              country: 'US',
              areaCodeAndNumber: '1632960891'
            }
          ]
        },
        customerIdentifier: '253658624374693'
      }
    };
    const context = {
      modifiedBy: 'Mike Morales',
      sub: '253658624374693',
      sub_userType: 'Carer',
      countryCode: 'US',
      obj: '253658624374693'
    };
    beforeEach(() => {
      const config = JSON.parse(configStr);
      accountService = new BoomiAccountService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });

    it('CASE: Requestor calls patchAccount to edit self', async () => {
      const obj = '253658624374693';
      const sagePayloadMapperReturnJson = {
        firstName: 'And',
        lastName: 'Sch',
        middleName: 'A.',
        dateOfBirth: '1993-08-13'
      };

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          updateAccount() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
        })()
      );

      sinon
        .stub(sagePayloadMapper, 'accountToSagePayload')
        .returns(sagePayloadMapperReturnJson);

      const resp = await accountService.patchAccount(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: Requestor as carer calls patchAccount to edit patient', async () => {
      const obj = '123';
      const sagePayloadMapperReturnJson = {
        firstName: 'And',
        lastName: 'Sch',
        middleName: 'A.',
        dateOfBirth: '1993-08-13'
      };

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          updateAccount() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .returns({});
      sinon
        .stub(
          BoomiSubjectRelation.prototype,
          'isPermittedToViewEditAccountDetails'
        )
        .returns(true);
      sinon
        .stub(sagePayloadMapper, 'accountToSagePayload')
        .returns(sagePayloadMapperReturnJson);

      const resp = await accountService.patchAccount(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: Requestor calls patchAccount to edit self with change to ocSMS', async () => {
      const obj = '253658624374693';
      const sagePayloadMapperReturnJson = {
        firstName: 'And',
        lastName: 'Sch',
        middleName: 'A.',
        dateOfBirth: '1993-08-13',
        mobile: {
          ocSms: 'Opt-In'
        }
      };
      const payloadWithOcSms = {
        request: {
          modifiedByApp: 'drx',
          account: {
            phones: {
              mobile: {
                ocSms: 'Opt-In'
              }
            }
          },
          customerIdentifier: '253658624374693'
        }
      };

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          updateAccount() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          updateAccountConsent() {
            return {};
          }
        })()
      );

      sinon
        .stub(sagePayloadMapper, 'accountToSagePayload')
        .returns(sagePayloadMapperReturnJson);

      const resp = await accountService.patchAccount(payloadWithOcSms, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });
  });
  afterEach(() => {
    sinon.restore();
  });
});
