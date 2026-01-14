'use strict';

const { expect } = require('chai');
const { sageResponseMapper } = require('../../../src/mapper/index.js');

describe('sageResponseToAccount', () => {
  const sageResponseAccount = {
    cochlearId: '123',
    personas: ['Recipient'],
    firstName: 'firstName',
    middleName: 'D.',
    lastName: 'lastName',
    preferredName: 'firstName lastName',
    dateOfBirth: '2001-03-25',
    isDeceased: false,
    mobile: '+13903689',
    email: 'firstNameLastName@sit.com',
    gender: 'Female',
    preferredCommsLanguage: 'en',
    primaryCountryCode: 'US',
    isUnderAge: false,
    metadata: {
      createdTimestamp: '2013-03-08T06:15:08.000+0000'
    }
  };

  const sageResponseAccountNoMidName = {
    cochlearId: '123',
    personas: ['Recipient'],
    firstName: 'firstName',
    lastName: 'lastName',
    preferredName: 'firstName lastName',
    dateOfBirth: '2001-03-25',
    isDeceased: false,
    mobile: '+13903689',
    email: 'firstNameLastName@sit.com',
    gender: 'Female',
    preferredCommsLanguage: 'en',
    primaryCountryCode: 'US',
    isUnderAge: false,
    metadata: {
      createdTimestamp: '2013-03-08T06:15:08.000+0000'
    }
  };

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


  const sageConsent = {
    status: 'Opt-Out',
    consentType: 'Informational',
    captureDate: '2024-05-08',
    captureSource: 'Automatic generated Consent',
    withdrawalReason: 'TOO_MANY_COMMUNICATIONS'
  };

  it('CASE: should map the Boomi Response to DRX API successfully', () => {
    const result = sageResponseMapper.sageResponseToAccount(
      sageResponseAccount,
      sageConsent,
      patientOrganisationRelationship
    );
    expect(result).with.property('firstName').to.equal('firstName');
    expect(result).with.property('middleName').to.equal('D.');
    expect(result).with.property('lastName').to.equal('lastName');
    expect(result).with.property('email').to.equal('firstNameLastName@sit.com');
    expect(result).with.property('dateOfBirth').to.equal('2001-03-25');
    expect(result).with.property('isDeceased').to.equal(false);
    expect(result).with.property('personas').to.deep.equal(['Recipient']);
    expect(result).with.property('clinic').to.equal('Atlantic Rehab Institute');
    expect(result)
      .with.property('phones')
      .to.deep.equal({
        mobile: {
          callingCode: '+1',
          countryCode: 'US',
          number: '3903689',
          ocSms: 'Opt-Out'
        }
      });
  });

  it('CASE: should map the Boomi Response to DRX API successfully - middleName is blank', () => {
    const result = sageResponseMapper.sageResponseToAccount(
      sageResponseAccountNoMidName,
      sageConsent,
      patientOrganisationRelationship
    );
    expect(result).with.property('firstName').to.equal('firstName');
    expect(result).with.property('middleName').to.equal('');
    expect(result).with.property('lastName').to.equal('lastName');
    expect(result).with.property('email').to.equal('firstNameLastName@sit.com');
    expect(result).with.property('dateOfBirth').to.equal('2001-03-25');
    expect(result).with.property('isDeceased').to.equal(false);
    expect(result).with.property('personas').to.deep.equal(['Recipient']);
    expect(result).with.property('clinic').to.equal('Atlantic Rehab Institute');
    expect(result)
      .with.property('phones')
      .to.deep.equal({
        mobile: {
          callingCode: '+1',
          countryCode: 'US',
          number: '3903689',
          ocSms: 'Opt-Out'
        }
      });
  });

  it('CASE: should map the Boomi Response to DRX API successfully for invalid phone - default to phone without parsing', () => {
    const result = sageResponseMapper.sageResponseToAccount(
      { ...sageResponseAccount, mobile: '903689' },
      sageConsent,
      patientOrganisationRelationship
    );
    expect(result).with.property('firstName').to.equal('firstName');
    expect(result).with.property('middleName').to.equal('D.');
    expect(result).with.property('lastName').to.equal('lastName');
    expect(result).with.property('email').to.equal('firstNameLastName@sit.com');
    expect(result).with.property('dateOfBirth').to.equal('2001-03-25');
    expect(result).with.property('isDeceased').to.equal(false);
    expect(result).with.property('personas').to.deep.equal(['Recipient']);
    expect(result).with.property('clinic').to.equal('Atlantic Rehab Institute');
    expect(result)
      .with.property('phones')
      .to.deep.equal({
        mobile: {
          callingCode: '',
          countryCode: 'US',
          number: '903689',
          ocSms: 'Opt-Out'
        }
      });
  });

  it('CASE: should map the Boomi Response to DRX API successfully without ocSMS (non-US)', () => {
    const result = sageResponseMapper.sageResponseToAccount(
      { ...sageResponseAccount, primaryCountryCode: 'UK' },
      sageConsent,
      patientOrganisationRelationship
    );
    expect(result).with.property('firstName').to.equal('firstName');
    expect(result).with.property('middleName').to.equal('D.');
    expect(result).with.property('lastName').to.equal('lastName');
    expect(result).with.property('email').to.equal('firstNameLastName@sit.com');
    expect(result).with.property('dateOfBirth').to.equal('2001-03-25');
    expect(result).with.property('isDeceased').to.equal(false);
    expect(result).with.property('personas').to.deep.equal(['Recipient']);
    expect(result).with.property('clinic').to.equal('Atlantic Rehab Institute');
    expect(result)
      .with.property('phones')
      .to.deep.equal({
        mobile: {
          callingCode: '+1',
          countryCode: 'UK',
          number: '3903689',
          ocSms: ''
        }
      });
  });
});
