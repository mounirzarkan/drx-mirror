'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {sfResponseMapper} = require('../../../src/mapper/index.js');

describe('sfResponseToAccount', () => {
  const sfResponseAccountStr = JSON.stringify({
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
  });
  it('CASE: when property name change is required for Front End, convert properties in account FirstName,LastName,PersonEmail,Date_of_Birth__pc,Marketing_Consent_Cochlear_Family__pc and return firstName,lastName,email,dateOfBirth,familyConsent', () => {
    const accountsFirstEntry = JSON.parse(sfResponseAccountStr);
    const result = sfResponseMapper.sfResponseToAccount(accountsFirstEntry);

    expect(result).with.property('firstName').to.equal('Ivan 3');
    expect(result).with.property('lastName').to.equal('Vasquez 2');
    expect(result).with.property('email').to.equal('unapa@cochlear.com');
    expect(result).with.property('dateOfBirth').to.equal('2015-04-03');
    expect(result).with.property('familyConsent').to.equal('Withdrawn');
  });

  it('CASE: when property name change is required for Front End sfResponseToAccount returns phones property', () => {
    const accountsFirstEntry = JSON.parse(sfResponseAccountStr);
    const result = sfResponseMapper.sfResponseToAccount(accountsFirstEntry);

    expect(result).with.property('phones').is.a('array');
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe('sfResponseToPhones', () => {
  const sfResponseAccountPhonesStr = JSON.stringify([
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
  ]);
  it('CASE: when property name change is required for Front End, sfResponseToPhones returns phone properties: type,phoneNumber,isValid,isPrimary', () => {
    const phones = JSON.parse(sfResponseAccountPhonesStr);
    const results = sfResponseMapper.sfResponseToPhones(phones, false);
    const result = results[0];
    expect(result).has.property('type');
    expect(result).has.property('phoneNumber');
    expect(result).has.property('isValid');
    expect(result).has.property('isPrimary');
  });

  it('CASE: when includeOcSms is set to false, sfResponseToPhones returns object with 4 own property names', () => {
    const includeOcSms = false;
    const phones = JSON.parse(sfResponseAccountPhonesStr);
    const result = sfResponseMapper.sfResponseToPhones(phones, includeOcSms);

    expect(Object.getOwnPropertyNames(result[0]))
      .with.property('length')
      .to.equal(4);
  });

  it('CASE: when includeOcSms is set to false, sfResponseToPhones returns object without "ocSms" property', () => {
    const includeOcSms = false;
    const phones = JSON.parse(sfResponseAccountPhonesStr);
    const result = sfResponseMapper.sfResponseToPhones(phones, includeOcSms);
    expect(result[0]).has.not.property('ocSms');
  });

  it('CASE: when includeOcSms is set to true, sfResponseToPhones returns object with 5 own property names', () => {
    const includeOcSms = true;
    const phones = JSON.parse(sfResponseAccountPhonesStr);
    const result = sfResponseMapper.sfResponseToPhones(phones, includeOcSms);

    expect(Object.getOwnPropertyNames(result[0]))
      .with.property('length')
      .to.equal(5);
  });

  it('CASE: when includeOcSms is set to true, sfResponseToPhones returns object with "ocSms" property', () => {
    const includeOcSms = true;
    const phones = JSON.parse(sfResponseAccountPhonesStr);
    const result = sfResponseMapper.sfResponseToPhones(phones, includeOcSms);
    expect(result[0]).has.property('ocSms');
  });

  afterEach(() => {
    sinon.restore();
  });
});
