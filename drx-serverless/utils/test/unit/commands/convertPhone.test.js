'use strict';

const {expect} = require('chai');
const {convertPhoneNumber} = require('../../../src/commands/convertPhone.js');

describe('SUITE: ConvertPhone', () => {
  describe('SCENARIO: To local number', () => {
    it('CASE : Convert US number', () => {
      const data = convertPhoneNumber('+12133734253');
      console.log(data);
      expect(data.country).equals('US');
    });

    it('CASE : Convert AU number', () => {
      const data = convertPhoneNumber('+61456421871');
      console.log(data);
      expect(data.country).equals('AU');
    });

    it('CASE : Convert RU number', () => {
      const data = convertPhoneNumber('+79855310868');
      console.log(data);
      expect(data.country).equals('RU');
    });
  });
});
