'use strict';

const {expect} = require('chai');
const {stringifyUtil} = require('../../../src/util/index.js');

const testData = {
  firstName: 'testFirstName',
  lastName: 'testLastName',
  age: 23,
  recipient: [
    {firstname: 'firstRecipient', lastName: 'lastRecipient', age: 40},
    {
      firstName: 'secondRecipientFirstName',
      lastName: 'secondRecipientlastName',
      age: 30
    }
  ]
};

describe('stringifyUtil test', () => {
  describe('#stringifyWithMask', () => {
    beforeEach(() => {
      process.env.logLevel = 'DEBUG';
    });
    it('should mask firstname.', () => {
      const retu = stringifyUtil.stringifyWithMask(
        true,
        ['FIRSTNAME'],
        testData
      );

      expect(retu).include(stringifyUtil.getLogMaskWording());
      expect(retu).not.include('testFirstName');
      expect(retu).not.include('firstRecipient');
      expect(retu).not.include('firstRecipient');
    });
    it('should not mask firstname.', () => {
      const retu = stringifyUtil.stringifyWithMask(
        false,
        ['FIRSTNAME'],
        testData
      );

      expect(retu).not.include(stringifyUtil.getLogMaskWording());
      expect(retu).to.include('testFirstName');
      expect(retu).to.include('firstRecipient');
      expect(retu).to.include('firstRecipient');
    });
    it('should mask firstname and age.', () => {
      const retu = stringifyUtil.stringifyWithMask(
        true,
        ['FIRSTNAME', 'AGE'],
        testData
      );

      expect(retu).include(stringifyUtil.getLogMaskWording());
      expect(retu).not.include('testFirstName');
      expect(retu).not.include('firstRecipient');
      expect(retu).not.include('firstRecipient');
      expect(retu).not.include('23');
      expect(retu).not.include('30');
    });
    afterEach(() => {
      // sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#getSensitiveData', () => {
    it('should load from config file.', () => {
      const retu = stringifyUtil.getSensitiveData();

      expect(retu).to.be.an('array');
      expect(retu.length).eq(3);
      expect(retu).to.includes('FIRSTNAME');
      expect(retu).to.includes('LASTNAME');
      expect(retu).to.includes('PHONENUMBER');
    });
  });
  describe('#getLogMaskWording', () => {
    it('should get masked by logUtils.', () => {
      const retu = stringifyUtil.getLogMaskWording();

      expect(retu).eq('masked by logUtils');
    });
  });
});
