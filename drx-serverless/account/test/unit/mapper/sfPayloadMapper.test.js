'use strict';

//const sinon = require('sinon');
const {expect} = require('chai');
const {sfPayloadMapper} = require('../../../src/mapper/index.js');

describe('SUITE: sfPayloadMapper', () => {
  describe('phonesToSfPayload', () => {
    const patchPhonesStr = JSON.stringify([
      {
        type: 'Mobile',
        phoneNumber: '111111111',
        ocSms: 'Given',
        isValid: true,
        isPrimary: false,
        country: '+1',
        areaCodeAndNumber: '1222'
      }
    ]);

    it('CASE: when includeOcSms is set to false, phonesToSfPayload returns an array', () => {
      const phones = JSON.parse(patchPhonesStr);
      const result = sfPayloadMapper.phonesToSfPayload(phones, false);
      expect(result)
        .to.be.a('array')
        .and.with.property('length')
        .greaterThan(0);
    });

    it('CASE: when includeOcSms is set to false, phonesToSfPayload returns object properties: type,phoneNumber,isValid,isPrimary,country,areaCodeAndNumber', () => {
      const phones = JSON.parse(patchPhonesStr);
      const results = sfPayloadMapper.phonesToSfPayload(phones, false);
      const result = results[0];
      expect(result).with.property('type').to.equal('Mobile');
      expect(result).with.property('phoneNumber').to.equal('111111111');
      expect(result).with.property('isValid').to.equal(true);
      expect(result).with.property('isPrimary').to.equal(false);
      expect(result).with.property('country').to.equal('+1');
      expect(result).with.property('areaCodeAndNumber').to.equal('1222');
    });

    it('CASE: when includeOcSms is set to false, phonesToSfPayload returns object with 6 own property names', () => {
      const phones = JSON.parse(patchPhonesStr);

      const result = sfPayloadMapper.phonesToSfPayload(phones, false);

      expect(Object.getOwnPropertyNames(result[0]))
        .with.property('length')
        .to.equal(6);
    });

    it('CASE: when includeOcSms is set to true, phonesToSfPayload returns an array', () => {
      const phones = JSON.parse(patchPhonesStr);
      const result = sfPayloadMapper.phonesToSfPayload(phones, true);
      expect(result)
        .to.be.a('array')
        .and.with.property('length')
        .greaterThan(0);
    });

    it('CASE: when includeOcSms is set to true, phonesToSfPayload returns object properties: type,phoneNumber,isValid,isPrimary,country,areaCodeAndNumber,ocSms', () => {
      const phones = JSON.parse(patchPhonesStr);

      const results = sfPayloadMapper.phonesToSfPayload(phones, true);
      const result = results[0];
      expect(result).with.property('type').to.equal('Mobile');
      expect(result).with.property('phoneNumber').to.equal('111111111');
      expect(result).with.property('isValid').to.equal(true);
      expect(result).with.property('isPrimary').to.equal(false);
      expect(result).with.property('country').to.equal('+1');
      expect(result).with.property('areaCodeAndNumber').to.equal('1222');
      expect(result).with.property('ocSms').to.equal('Given');
    });

    it('CASE: when includeOcSms is set to true, phonesToSfPayload returns object with 7 own property names', () => {
      const phones = JSON.parse(patchPhonesStr);

      const results = sfPayloadMapper.phonesToSfPayload(phones, true);
      const result = results[0];
      expect(Object.getOwnPropertyNames(result))
        .with.property('length')
        .to.equal(7);
    });
  });

  describe('accountToSfPayload', () => {
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

    it('CASE: when converting patch account details, accountToSfPayload returns object properties: FirstName,LastName,Date_of_Birth__pc', () => {
      const {request} = JSON.parse(patchPersonalChangePayloadStr);
      const result = sfPayloadMapper.accountToSfPayload(request.account);

      expect(result).with.property('FirstName').to.equal('Andrew');
      expect(result).with.property('LastName').to.equal('Schultz');
      expect(result).with.property('Date_of_Birth__pc').to.equal('1993-08-11');
    });

    it('CASE: when converting patch account details, accountToSfPayload returns object with phones own property (array)', () => {
      const {request} = JSON.parse(patchPhoneChangePayloadStr);
      const result = sfPayloadMapper.accountToSfPayload(request.account);
      expect(result).with.property('phones').is.a('array');
    });
  });
});
