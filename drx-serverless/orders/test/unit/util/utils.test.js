'use strict';
const {expect} = require('chai');
const utils = require('../../../src/util/utils');
describe('SUITE: filterObjProperties', () => {
  const objStr = JSON.stringify({
    property1: 'value1',
    property2: 'value2',
    property3: 'value3',
    property4: 'value4'
  });

  it('CASE: filters properties on obj returning an object with 3 properties property1,property3,property4', () => {
    const obj = JSON.parse(objStr);
    const filterProperties = ['property1', 'property3', 'property4'];
    const result = utils.filterObjProperties(obj, filterProperties);
    expect(result).with.property('property1');
    expect(result).with.property('property3');
    expect(result).with.property('property4');
    expect(Object.getOwnPropertyNames(result).length).to.equal(3);
  });

  it('CASE: filters properties on obj returning an object subsequent properties equaling: value1,value3,value4', () => {
    const obj = JSON.parse(objStr);
    const filterProperties = ['property1', 'property3', 'property4'];
    const result = utils.filterObjProperties(obj, filterProperties);
    expect(result).with.property('property1').to.equal('value1');
    expect(result).with.property('property3').to.equal('value3');
    expect(result).with.property('property4').to.equal('value4');
  });

  it('CASE: getQueryPartyId when sub===obj returns "1111"', () => {
    const partyId = '1111';
    const carerRecipients = [];
    const sub = '11111111';
    const obj = '11111111';
    const userType = 'Recipient';
    const result = utils.getQueryPartyId(
      partyId,
      carerRecipients,
      sub,
      obj,
      userType
    );

    expect(result).to.equal('1111');
  });

  it('CASE: getQueryPartyId when sub===obj but has empty partyId returns null', () => {
    const partyId = null;
    const carerRecipients = [];
    const sub = '11111111';
    const obj = '11111111';
    const userType = 'Recipient';
    const result = utils.getQueryPartyId(
      partyId,
      carerRecipients,
      sub,
      obj,
      userType
    );

    expect(result).to.equal(null);
  });

  it('CASE: getQueryPartyId when sub!==obj and no carerRecipients returns undefined', () => {
    const partyId = '1111';
    const carerRecipients = [];
    const sub = '11111111';
    const obj = '22222222';
    const userType = 'Recipient';
    const result = utils.getQueryPartyId(
      partyId,
      carerRecipients,
      sub,
      obj,
      userType
    );

    expect(result).to.equal(undefined);
  });

  it('CASE: getQueryPartyId when Carer queries a matched carerRecipients returns "2222"', () => {
    const partyId = '1111';
    const carerRecipients = [{CochlearId: '22222222', PartyId: '2222'}];
    const sub = '11111111';
    const obj = '22222222';
    const userType = 'Carer';
    const result = utils.getQueryPartyId(
      partyId,
      carerRecipients,
      sub,
      obj,
      userType
    );

    expect(result).to.equal('2222');
  });

  it('CASE: getQueryPartyId when Carer queries a non-matched carerRecipients returns undefined', () => {
    const partyId = '1111';
    const carerRecipients = [{CochlearId: '22222222', PartyId: '2222'}];
    const sub = '11111111';
    const obj = '33333333';
    const userType = 'Carer';
    const result = utils.getQueryPartyId(
      partyId,
      carerRecipients,
      sub,
      obj,
      userType
    );

    expect(result).to.equal(undefined);
  });
});

describe('SUITE: stringCompareIgnoreCase', function () {
  it('CASE: should compare two strings ignoring case', function () {
    const str1 = 'Hello World';
    const str2 = 'hello world';
    const result = utils.stringCompareIgnoreCase(str1, str2);
    expect(result).to.be.true;
  });

  it('CASE: should return true for two empty strings', function () {
    const str1 = '';
    const str2 = '';
    const result = utils.stringCompareIgnoreCase(str1, str2);
    expect(result).to.be.true;
  });

  it('CASE: should return false for two different strings', function () {
    const str1 = 'Hello World';
    const str2 = 'Goodbye World';
    const result = utils.stringCompareIgnoreCase(str1, str2);
    expect(result).to.be.false;
  });
});

describe('SUITE: addCurrency', function () {
  it('CASE: should add two currency values correctly', function () {
    const first = '0.1';
    const second = '0.2';
    const toFixed = 2;
    const expected = '0.30';
    const result = utils.addCurrency(first, second, toFixed);
    expect(result).to.equal(expected);
  });
});

describe('SUITE: formatDate', function () {
  it('CASE: it should format date correctly', function () {
    const isoString = '2024-06-05T05:25:14Z';
    const expected = '2024-06-06';
    const result = utils.formatDate(isoString);
    expect(result).to.equal(expected);
  });
});

// TODO stub date
describe.skip('SUITE: filterAndSortByDate', function () {
  it('CASE: should filter and sort array by date correctly', function () {
    const array = [
      {orderDate: '2024-06-01T00:00:00Z'},
      {orderDate: '2024-06-03T00:00:00Z'},
      {orderDate: '2024-06-05T00:00:00Z'}
    ];
    const days = 3;
    const expected = [
      {orderDate: '2024-06-05T00:00:00Z'},
      {orderDate: '2024-06-03T00:00:00Z'}
    ];
    const result = utils.filterAndSortByDate(array, days);
    expect(result).to.deep.equal(expected);
  });
});
