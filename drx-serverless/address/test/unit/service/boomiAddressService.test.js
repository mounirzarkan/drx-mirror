'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { BoomiAddressService } = require('../../../src/service/index.js');
const { BoomiSubjectRelation } = require('../../../src/relation/index.js');
const connectors = require('../../../src/connector/index.js');
const { debug } = require('../../../src/util/logUtil.js');
const { sagePayloadMapper } = require('../../../src/mapper/index.js');
chai.use(chaiAsPromised);

describe('SUITE: BoomiAddressService - Unit Integration Test', () => {
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

  describe('SUITE: retrieveAddress flow', () => {
    let addressService = undefined;

    const boomiResponseAddressStr = JSON.stringify({
      _meta: {
        totalRecords: 3,
        page: 1,
        limit: 10,
        count: 3
      },
      patientAddress: [
        {
          id: 'a0H24000001yfZWEAY',
          street: [
            'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
          ],
          city: 'KNOXVILLE',
          state: 'TN',
          stateCode: 'TN',
          postalCode: '37920',
          country: 'United States',
          countryCode: 'US'
        },
        {
          id: 'a0HE000000k5fr8MAA',
          street: [
            'Lauderdale Community Hospital Attn Kelvin Parr\n326 Asbury Ave'
          ],
          city: 'RIPLEY',
          state: 'TN',
          stateCode: 'TN',
          postalCode: '38063',
          country: 'United States',
          countryCode: 'US'
        },
        {
          id: 'a0H1p00000NFVjJEAX',
          street: ['357 Moore St'],
          city: 'RIPLEY',
          state: 'TN',
          stateCode: 'TN',
          postalCode: '38063',
          country: 'United States',
          countryCode: 'US',
          primaryTypes: ['Billing', 'Shipping']
        }
      ]
    });

    const getAddressResultStr = JSON.stringify([
      {
        value: {
          addressId: 'a0H24000001yfZWEAY',
          address: {
            street: [
              'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
            ],
            city: 'KNOXVILLE',
            state: 'TN',
            postalCode: '37920',
            stateCode: 'TN'
          },
          isPO: ''
        },
        isBilling: false,
        isMailing: false,
        isShipping: false,
        countryIso2Code: 'US',
        countryName: 'United States'
      },
      {
        value: {
          addressId: 'a0HE000000k5fr8MAA',
          address: {
            street: [
              'Lauderdale Community Hospital Attn Kelvin Parr\n326 Asbury Ave'
            ],
            city: 'RIPLEY',
            state: 'TN',
            postalCode: '38063',
            stateCode: 'TN'
          },
          isPO: ''
        },
        isBilling: false,
        isMailing: false,
        isShipping: false,
        countryIso2Code: 'US',
        countryName: 'United States'
      },
      {
        value: {
          addressId: 'a0H1p00000NFVjJEAX',
          address: {
            street: ['357 Moore St'],
            city: 'RIPLEY',
            state: 'TN',
            postalCode: '38063',
            stateCode: 'TN'
          },
          isPO: ''
        },
        isBilling: true,
        isMailing: false,
        isShipping: true,
        countryIso2Code: 'US',
        countryName: 'United States'
      }
    ]);

    beforeEach(() => {
      const config = JSON.parse(configStr);
      addressService = new BoomiAddressService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });

    it('CASE: Requestor calls retrieve address - returns list of own address', async () => {
      const sub = '198835944744967';
      const obj = '198835944744967';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return JSON.parse();
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressStr);
          }
        })()
      );

      const result = await addressService.retrieveAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      });

      const getAddressResult = JSON.parse(getAddressResultStr);
      expect(result).to.deep.equal(getAddressResult);
    });

    it('CASE: Requestor requests address on behalf of carer/recipient - is permitted', async () => {
      //obj is id query param?
      //sub is requestor?
      const sub = '198835944744967';
      const obj = '187509945837581';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return {};
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressStr);
          }
          getPatient() {
            return {};
          }
          getPatientRelationship() {
            return {};
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );

      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(true);

      const result = await addressService.retrieveAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      });
      debug(result);

      const getAddressResult = JSON.parse(getAddressResultStr);
      expect(result).to.deep.equal(getAddressResult);
    });

    it('CASE: Requestor requests address on behalf of carer/recipient - is not permitted', async () => {
      //obj is id query param?
      //sub is requestor?
      const sub = '198835944744967';
      const obj = '187509945837581';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return {};
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressStr);
          }
          getPatient() {
            return {};
          }
          getPatientRelationship() {
            return {};
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );

      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(false);

      await expect(addressService.retrieveAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      }))
        .to.eventually.be.rejectedWith('451');
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: readAddress flow', () => {
    let addressService = undefined;

    const boomiResponseAddressStr = JSON.stringify({
      id: 'a0H24000001yfZWEAY',
      street: [
        'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
      ],
      city: 'KNOXVILLE',
      state: 'TN',
      postalCode: '37920',
      countryCode: 'US',
      stateCode: 'TN',
      primaryTypes: ['Mailing', 'Shipping']
    });

    const getAddressResultStr = JSON.stringify({
      value: {
        addressId: 'a0H24000001yfZWEAY',
        address: {
          street: [
            'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
          ],
          city: 'KNOXVILLE',
          state: 'TN',
          postalCode: '37920',
          stateCode: 'TN'
        },
        isPO: ''
      },
      isBilling: false,
      isMailing: true,
      isShipping: true,
      countryIso2Code: 'US',
      countryName: 'United States'
    });

    beforeEach(() => {
      const config = JSON.parse(configStr);
      addressService = new BoomiAddressService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });

    it('CASE: Requestor calls read address - returns own address', async () => {
      const sub = '198835944744967';
      const obj = '198835944744967';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return JSON.parse();
          }
          getAddresses() {
            return {};
          }
          getAddress() {
            return JSON.parse(boomiResponseAddressStr);
          }
        })()
      );

      const result = await addressService.readAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      });
      debug(result);

      const getAddressResult = JSON.parse(getAddressResultStr);
      expect(result).to.deep.equal(getAddressResult);
    });

    it('CASE: Requestor requests address on behalf of carer/recipient - is permitted', async () => {
      //obj is id query param?
      //sub is requestor?
      const sub = '198835944744967';
      const obj = '187509945837581';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return {};
          }
          getAddresses() {
            return {};
          }
          getAddress() {
            return JSON.parse(boomiResponseAddressStr);
          }
          getPatient() {
            return {};
          }
          getPatientRelationship() {
            return {};
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );

      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(true);

      const result = await addressService.readAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      });
      debug(result);

      const getAddressResult = JSON.parse(getAddressResultStr);
      expect(result).to.deep.equal(getAddressResult);
    });

    it('CASE: Requestor requests address on behalf of carer/recipient - is not permitted', async () => {
      //obj is id query param?
      //sub is requestor?
      const sub = '198835944744967';
      const obj = '187509945837581';
      const sub_userType = 'Recipient';
      const countryCode = 'US';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }

          getToken() {
            return {};
          }
          getAddresses() {
            return {};
          }
          getAddress() {
            return JSON.parse(boomiResponseAddressStr);
          }
          getPatient() {
            return {};
          }
          getPatientRelationship() {
            return {};
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );

      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(false);

      await expect(addressService.readAddress({
        sub,
        sub_userType,
        countryCode,
        obj
      }))
        .to.eventually.be.rejectedWith('451');
    });
    afterEach(() => {
      sinon.restore();
    });
  });

  //updateAddress -> createAddress
  describe('SUITE: updateAddress', () => {
    let addressService = undefined;
    const payload = {
      request: {
        modifiedByApp: 'drx',
        address: {},
        customerIdentifier: '253658624374693'
      }
    };

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
    beforeEach(() => {
      const config = JSON.parse(configStr);
      addressService = new BoomiAddressService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });
    it('CASE: Requestor calls updateAddress to create own address', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '253658624374693'
      };
      const obj = '253658624374693';
      const sagePayloadMapperReturnJson = {
        street: ['street1'],
        city: 'city1',
        state: 'state1',
        postalCode: '2020',
        countryCode: 'DM',
        primaryTypes: ['Billing']
      };
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          createAddress() {
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
        .stub(sagePayloadMapper, 'sagePayloadAddressMapper')
        .returns(sagePayloadMapperReturnJson);
      const resp = await addressService.updateAddress(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });
    it('CASE: Requestor requests to create address on behalf of carer/recipient - is permitted', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '1234'
      };
      const obj = '1234';
      const sagePayloadMapperReturnJson = {
        street: ['street1'],
        city: 'city1',
        state: 'state1',
        postalCode: '2020',
        countryCode: 'DM',
        primaryTypes: ['Billing']
      };
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          createAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(true);
      sinon
        .stub(sagePayloadMapper, 'sagePayloadAddressMapper')
        .returns(sagePayloadMapperReturnJson);
      const resp = await addressService.updateAddress(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: Requestor requests to create address on behalf of carer/recipient - is not permitted', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '1234'
      };
      const obj = '1234';
      const sagePayloadMapperReturnJson = {
        street: ['street1'],
        city: 'city1',
        state: 'state1',
        postalCode: '2020',
        countryCode: 'DM',
        primaryTypes: ['Billing']
      };
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          createAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(false);
      sinon
        .stub(sagePayloadMapper, 'sagePayloadAddressMapper')
        .returns(sagePayloadMapperReturnJson);
      await expect(
        addressService.updateAddress(payload, context, obj)
      ).to.be.rejectedWith('Carer/Recipient operation not allowed');
    });
  });

  //updateAddress -> createAddress
  describe('SUITE: patchAddress', () => {
    let addressService = undefined;
    const payload = {
      request: {
        modifiedByApp: 'drx',
        customerIdentifier: '253658624374693'
      }
    };

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

    const boomiResponseAddressesStr = JSON.stringify({
      patientAddress: [
        {
          id: '8lW9M000000C7DpUAK',
          primaryTypes: ['Billing']
        },
        {
          id: 'W9M000000C7DpUAK'
        }
      ]
    });
    beforeEach(() => {
      const config = JSON.parse(configStr);
      addressService = new BoomiAddressService({
        ...config,
        cache: { getCustomKeyCache: function () { } },
        cacheRepo: { get: function () { }, save: function () { } }
      });
    });

    it('CASE: Requestor calls patchAddress to update own address', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '253658624374693'
      };
      const obj = '253658624374693';
      const primaryTypesReturnJson = ['Mailing', 'Shipping'];
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          patchAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressesStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
        })()
      );
      sinon
        .stub(sagePayloadMapper, 'generatePrimaryTypes')
        .returns(primaryTypesReturnJson);
      const resp = await addressService.patchAddress(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: Requestor requests to update address on behalf of carer/recipient - is permitted', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '1234'
      };
      const obj = '1234';
      const primaryTypesReturnJson = ['Mailing', 'Shipping'];
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          patchAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressesStr);
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(true);
      sinon
        .stub(sagePayloadMapper, 'generatePrimaryTypes')
        .returns(primaryTypesReturnJson);
      const resp = await addressService.patchAddress(payload, context, obj);
      expect(resp).with.property('status').to.equal(200);
    });

    it('CASE: Requestor requests to update address on behalf of carer/recipient - is not permitted', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '1234'
      };
      const obj = '1234';
      const primaryTypesReturnJson = ['Billing'];
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          patchAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressesStr);
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(false);
      sinon
        .stub(sagePayloadMapper, 'generatePrimaryTypes')
        .returns(primaryTypesReturnJson);

      await expect(addressService.patchAddress(payload, context, obj))
        .to.eventually.be.rejectedWith('Carer/Recipient operation not allowed')
        .and.have.property('statusCode')
        .to.equal('451');
    });

    it('CASE: Should throw if one or more tags is missing when doing an update/patch', async () => {
      const context = {
        modifiedBy: 'Mike Morales',
        sub: '253658624374693',
        sub_userType: 'Carer',
        countryCode: 'US',
        obj: '1234'
      };
      const obj = '1234';
      const primaryTypesReturnJson = ['Billing'];
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() { }
          getToken() {
            return JSON.parse();
          }
          patchAddress() {
            return { status: 200 };
          }
          getPatientRelationship() {
            return JSON.parse(boomiRelationshipStr);
          }
          getPatient() {
            return JSON.parse(boomiResponseAccountsStr);
          }
          getAddresses() {
            return JSON.parse(boomiResponseAddressesStr);
          }
          getPatientRelationshipDependent() {
            return {};
          }
        })()
      );
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setCarerRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'setPatientRelations')
        .resolves({});
      sinon
        .stub(BoomiSubjectRelation.prototype, 'isPermittedToViewEdit')
        .returns(true);
      sinon
        .stub(sagePayloadMapper, 'generatePrimaryTypes')
        .returns(primaryTypesReturnJson);
      await expect(addressService.patchAddress(payload, context, obj))
        .to.eventually.be.rejectedWith('Tags missing: Shipping, Mailing')
        .and.have.property('statusCode')
        .to.equal('409');
    });
  });
  afterEach(() => {
    sinon.restore();
  });
});
