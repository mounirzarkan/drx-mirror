'use strict';

// const _ = require('lodash');
// const sinon = require('sinon');
const {expect} = require('chai');
const {utils} = require('../../../src/util/index.js');

describe('SUITE: utils', () => {
  describe('#stringCompareIgnoreCase', () => {
    it('should be true if both are null', () => {
      expect(utils.stringCompareIgnoreCase(null, null)).to.be.true;
    });
    it('should be true if both are undefined', () => {
      expect(utils.stringCompareIgnoreCase(undefined, undefined)).to.be.true;
    });
    it('should be true if input are undefined or null', () => {
      expect(utils.stringCompareIgnoreCase(undefined, null)).to.be.true;
    });
    it('should be true if input are strings ignore case', () => {
      expect(utils.stringCompareIgnoreCase('test', 'TesT')).to.be.true;
    });
    it('should be false if input are not identical strings ignore case', () => {
      expect(utils.stringCompareIgnoreCase('test', 'Hello')).to.be.false;
    });
  });
  describe('#checkAllArgsNotEmpty', () => {
    it('should be true, if args are not null', () => {
      expect(utils.checkAllArgsNotEmpty(['arg1', 'arg2'])).to.be.true;
    });
    it('should be false, if args are null', () => {
      expect(utils.checkAllArgsNotEmpty(null)).to.be.false;
    });
    it('should be false, if some args are null', () => {
      expect(utils.checkAllArgsNotEmpty([null, 'arg2'])).to.be.false;
    });
  });
  describe('#encodeForm', () => {
    it('should encode properly', () => {
      expect(utils.encodeForm({field1: 'value1', field2: 'value2'})).to.eq(
        'field1=value1&field2=value2'
      );
    });
  });

  describe('SUITE: utils isAboveAgeBracket', () => {
    it('CASE: isAboveAgeBracket when min age is undefined returns true', () => {
      const result = utils.isAboveAgeBracket('2012-12-17T03:24:00', undefined);
      expect(result).to.equal(true);
    });

    it('CASE: isAboveAgeBracket when age is below 18 return false', () => {
      const result = utils.isAboveAgeBracket('2012-12-17T03:24:00', 18);
      expect(result).to.equal(false);
    });

    it('CASE: isAboveAgeBracket when age is above 18 return true', () => {
      const result = utils.isAboveAgeBracket('1994-12-17T03:24:00', 18);
      expect(result).to.equal(true);
    });
  });

  describe('abbreviatePermissions', () => {
    it('CASE: when permission object has a property with value equal to "read and write", abbreviatePermissions returns a new object with value set "rw"', () => {
      const obj = {firstName: {value: 'read and write'}};
      const {abbreviateObj} = utils.abbreviatePermissions(obj);

      expect(abbreviateObj)
        .with.property('firstName')
        .with.property('value')
        .to.equal('rw');
    });

    it('CASE: when permission object has a property with value equal to "read and write", abbreviatePermissions returns readOnlyForm = false', () => {
      const obj = {firstName: {value: 'read and write'}};
      const {readOnlyForm} = utils.abbreviatePermissions(obj);

      expect(readOnlyForm).to.equal(false);
    });

    it('CASE: when permission object has a property with value equal to "read only", abbreviatePermissions returns a new object with value set "r"', () => {
      const obj = {firstName: {value: 'read only'}};
      const {abbreviateObj} = utils.abbreviatePermissions(obj);

      expect(abbreviateObj)
        .with.property('firstName')
        .with.property('value')
        .to.equal('r');
    });

    it('CASE: when permission object has a property with value equal to "read only", abbreviatePermissions returns readOnlyForm = true', () => {
      const obj = {firstName: {value: 'read only'}};
      const {readOnlyForm} = utils.abbreviatePermissions(obj);

      expect(readOnlyForm).to.equal(true);
    });

    it('CASE: when permission object has a two properties with values equal to "read and write" and "read only", abbreviatePermissions returns readOnlyForm = false', () => {
      const obj = {
        firstName: {value: 'read and write'},
        phones: {value: 'read only'}
      };
      const {readOnlyForm} = utils.abbreviatePermissions(obj);
      expect(readOnlyForm).to.equal(false);
    });
  });

  describe('SUITE: utils decorateObject', () => {
    const permissionObjStr = JSON.stringify({
      _metadata: {
        readOnlyForm: false
      },
      addressId: {
        value: 'rw'
      },
      street1: {
        value: 'rw'
      },
      street2: {
        value: 'rw'
      },
      street3: {
        value: 'rw'
      },
      street4: {
        value: 'rw'
      },
      city: {
        value: 'rw'
      },
      state: {
        value: 'rw'
      },
      postalCode: {
        value: 'rw'
      },
      countryIso2Code: {
        value: 'r'
      }
    });
    it('CASE: decorateObject when empty obj is parsed with permissionsObj returns objects with properties: _metadata,addressId,street1,street2,street3,street4,city,state,postalCode,countryIso2Code', () => {
      const obj = {};
      const permissionsObj = JSON.parse(permissionObjStr);
      const result = utils.decorateObject(obj, permissionsObj);

      expect(result).has.property('_metadata');
      expect(result).has.property('addressId');
      expect(result).has.property('street1');
      expect(result).has.property('street2');
      expect(result).has.property('street3');
      expect(result).has.property('street4');
      expect(result).has.property('city');
      expect(result).has.property('state');
      expect(result).has.property('postalCode');
      expect(result).has.property('countryIso2Code');
    });

    it('CASE: decorateObject when address obj is parsed with permissionsObj returns objects with properties: _metadata,addressId,street1,street2,street3,street4,city,state,postalCode,countryIso2Code', () => {
      const obj = {
        customerIdentifier: '162748173278165',
        addressId: 'a0H7Y000005gw2VUAQ',
        street1: '7116 Pheasant Grove Dr',
        street2: null,
        street3: null,
        street4: null,
        city: 'Cypress',
        state: 'TX',
        postalCode: '77433-1047',
        countryIso2Code: 'US'
      };
      const permissionsObj = JSON.parse(permissionObjStr);
      const result = utils.decorateObject(obj, permissionsObj);

      expect(result).has.property('_metadata');
      expect(result).has.property('addressId');
      expect(result).has.property('street1');
      expect(result).has.property('street2');
      expect(result).has.property('street3');
      expect(result).has.property('street4');
      expect(result).has.property('city');
      expect(result).has.property('state');
      expect(result).has.property('postalCode');
      expect(result).has.property('countryIso2Code');
    });

    it('CASE: when permissions has undefined property, decorateObject should not throw error.', () => {
      const obj = {
        customerIdentifier: '162748173278165',
        addressId: 'a0H7Y000005gw2VUAQ',
        street1: '7116 Pheasant Grove Dr',
        street2: null,
        street3: null,
        street4: null,
        city: 'Cypress',
        state: 'TX',
        postalCode: '77433-1047',
        countryIso2Code: 'US'
      };
      const permissionsObj = JSON.parse(permissionObjStr);
      permissionsObj.other = undefined;
      expect(
        utils.decorateObject.bind(undefined, obj, permissionsObj)
      ).not.to.throw();
    });

    it('CASE: when permissions has undefined property, decorateObject returns objects with properties: _metadata,addressId,street1,street2,street3,street4,city,state,postalCode,countryIso2Code.', () => {
      const obj = {
        customerIdentifier: '162748173278165',
        addressId: 'a0H7Y000005gw2VUAQ',
        street1: '7116 Pheasant Grove Dr',
        street2: null,
        street3: null,
        street4: null,
        city: 'Cypress',
        state: 'TX',
        postalCode: '77433-1047',
        countryIso2Code: 'US'
      };
      const permissionsObj = JSON.parse(permissionObjStr);
      permissionsObj.other = undefined;
      const result = utils.decorateObject(obj, permissionsObj);
      expect(result).has.property('_metadata');
      expect(result).has.property('addressId');
      expect(result).has.property('street1');
      expect(result).has.property('street2');
      expect(result).has.property('street3');
      expect(result).has.property('street4');
      expect(result).has.property('city');
      expect(result).has.property('state');
      expect(result).has.property('postalCode');
      expect(result).has.property('countryIso2Code');
    });
  });
});
