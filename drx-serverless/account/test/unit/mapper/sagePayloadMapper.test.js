'use strict';

//const sinon = require('sinon');
const { expect } = require('chai');
const { sagePayloadMapper } = require('../../../src/mapper/index.js');

describe('SUITE: sagePayloadMapper', () => {
  describe('accountToSagePayload', () => {
    let countryCode = 'US';
    const patchAccountPayloadStr = {
      customerIdentifier: 'cochlearId',
      modifiedByApp: 'drx',
      account: {
        firstName: 'Andrew',
        lastName: 'Schultz',
        middleName: 'A.',
        dateOfBirth: '1993-08-11',
        email: 'abc@abc.com',
        phones: {
          phone: {
            callingCode: '+2',
            number: '123'
          },
          mobile: {
            number: '543'
          }
        }
      }
    };

    it('CASE: when converting patch account details, accountToSagePayload returns object properties: firstName,lastName,dateOfBirth, phone, mobile', () => {
      const result = sagePayloadMapper.accountToSagePayload(
        countryCode,
        patchAccountPayloadStr.account
      );

      expect(result).with.property('firstName').to.equal('Andrew');
      expect(result).with.property('lastName').to.equal('Schultz');
      expect(result).with.property('middleName').to.equal('A.');
      expect(result).with.property('dateOfBirth').to.equal('1993-08-11');
      expect(result).with.property('phone').to.equal('+2123');
      expect(result).with.property('mobile').to.equal('543');
      expect(result).with.property('email').to.equal('abc@abc.com');
    });

    it('CASE: when converting patch account details, accountToSagePayload returns object properties with blank email', () => {
      patchAccountPayloadStr.account.email = '';
      const result = sagePayloadMapper.accountToSagePayload(
        countryCode,
        patchAccountPayloadStr.account
      );
      expect(result).with.property('email').to.equal('');
    });

    it('CASE: when converting patch account details, accountToSagePayload returns object properties: firstName ,dateOfBirth', () => {
      delete patchAccountPayloadStr.account.lastName;

      const result = sagePayloadMapper.accountToSagePayload(
        countryCode,
        patchAccountPayloadStr.account
      );

      expect(result).with.property('firstName').to.equal('Andrew');
      expect(result).with.property('dateOfBirth').to.equal('1993-08-11');
      expect(result).with.property('middleName').to.equal('A.');
      expect(result).with.property('email').to.equal('');
      expect(result).not.with.property('lastName');
    });

    it('CASE: when converting patch account details, accountToSagePayload does not return middleName for non US', () => {
      countryCode = 'UK';
      const result = sagePayloadMapper.accountToSagePayload(
        countryCode,
        patchAccountPayloadStr.account
      );
      expect(result).with.property('firstName').to.equal('Andrew');
      expect(result).with.property('dateOfBirth').to.equal('1993-08-11');
      expect(result).not.with.property('lastName');
      expect(result).not.with.property('middleName');
    });
  });
});
