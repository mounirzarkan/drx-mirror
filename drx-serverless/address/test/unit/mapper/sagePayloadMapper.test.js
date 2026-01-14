'use strict';

const {expect} = require('chai');
const {sagePayloadMapper} = require('../../../src/mapper/index.js');

describe('SUITE: sagePayloadMapper', () => {
  describe('sagePayloadAddressMapper', () => {
    it('CASE: when converting account details, sagePayloadAddressMapper returns object properties: street, city, state, postalCode, countryCode, primaryTypes', () => {
      const payloadAddress = {
        street1: 'street1',
        street2: 'street2',
        city: 'city1',
        state: 'state1',
        postalCode: '2020',
        countryIso2Code: 'DM',
        isBilling: true,
        stateCode: 'stateCode1'
      };
      const result = sagePayloadMapper.sagePayloadAddressMapper(payloadAddress);

      expect(result)
        .with.property('street')
        .to.deep.equal(['street1', 'street2']);
      expect(result).with.property('city').to.equal('city1');
      expect(result).not.with.property('state')
      expect(result).with.property('postalCode').to.equal('2020');
      expect(result).with.property('countryCode').to.equal('DM');
      expect(result).with.property('primaryTypes').to.deep.equal(['Billing']);
      expect(result).with.property('stateCode').to.deep.equal('stateCode1');
    });

    it('CASE: when converting account details, sagePayloadAddressMapper returns partial object properties: street, city, countryCode', () => {
      const payloadAddress = {
        street1: 'street1',
        street2: 'street2',
        city: 'city1',
        countryIso2Code: 'DM',
        isMailing: true,
        isShipping: true,
        stateCode: 'stateCode2'
      };

      const result = sagePayloadMapper.sagePayloadAddressMapper(payloadAddress);
      expect(result)
        .with.property('street')
        .to.deep.equal(['street1', 'street2']);
      expect(result).with.property('city').to.equal('city1');
      expect(result).with.property('countryCode').to.equal('DM');
      expect(result).not.with.property('state');
      expect(result).not.with.property('postalCode');
      expect(result).not.with.property('state');
      expect(result).with.property('stateCode').to.equal('stateCode2');;
      expect(result)
        .with.property('primaryTypes')
        .to.deep.equal(['Shipping', 'Mailing']);
    });

    it('CASE: when converting account details, sagePayloadAddressMapper should throw if street1 or countryCode is not provided', () => {
      const payloadAddress = {
        city: 'city1',
        countryCode: 'DM'
      };
      expect(
        sagePayloadMapper.sagePayloadAddressMapper.bind(
          sagePayloadMapper,
          payloadAddress
        )
      )
        .to.throw()
        .with.property('message')
        .to.equal('Parameters street/country code not defined');
    });

    it('CASE: when converting account details, sagePayloadAddressMapper should throw if street length > 3', () => {
      const payloadAddress = {
        street1: 'street1',
        street2: 'street2',
        street3: 'street3',
        street4: 'street4',
        city: 'city1',
        countryIso2Code: 'DM'
      };
      expect(
        sagePayloadMapper.sagePayloadAddressMapper.bind(
          sagePayloadMapper,
          payloadAddress
        )
      )
        .to.throw()
        .with.property('message')
        .to.equal('Street max length should be 3');
    });

    it('CASE: when converting account details, sagePayloadAddressMapper should throw if primaryTypes is undefined', () => {
      const {isBilling, isShipping, isMailing} = [false, false, false];
      expect(
        sagePayloadMapper.generatePrimaryTypes.bind(
          sagePayloadMapper,
          isBilling,
          isShipping,
          isMailing
        )
      )
        .to.throw()
        .with.property('message')
        .to.equal('Tag should have at least one entry');
    });
  });
});
