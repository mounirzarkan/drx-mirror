'use strict';
// const _ = require('lodash');
const expect = require('chai').expect;
const sinon = require('sinon');
const {utils} = require('../../src/util/index.js');
const {checkAllArgsNotEmpty, getSFIntegrationCreds, encodeForm} = utils;
const eventBodyBad = '{"name" : "<script>alert("xss");</script>"}';

afterEach(() => {
  // Restore the default sandbox here
  sinon.restore();
});

describe('test checkArg', () => {
  describe('test function allArgsNotEmpty', () => {
    it('no args should return false', () => {
      const checkResult = checkAllArgsNotEmpty();
      expect(checkResult).to.be.false;
    });
    it('one empty string arg should return false', () => {
      const checkResult = checkAllArgsNotEmpty('');
      expect(checkResult).to.be.false;
    });
    it('multi args with one empty string should return false', () => {
      const checkResult = checkAllArgsNotEmpty(['argStr1', '', 'argStr2']);
      expect(checkResult).to.be.false;
    });
    it('multi args with one null should return false', () => {
      const checkResult = checkAllArgsNotEmpty(['argStr1', null, 'argStr2']);
      expect(checkResult).to.be.false;
    });
  });
});

describe('test getSFIntegrationCreds', () => {
  it('no args should return error', () => {
    expect(() => getSFIntegrationCreds()).to.throw('invalid input.');
  });
  it('no one args should return error', () => {
    expect(() => getSFIntegrationCreds('arg1', null, 'arg3', 'arg4')).to.throw(
      'invalid input.'
    );
  });
  it('success call', () => {
    // prettier-ignore
    const dataStr = '{ "secret": "asbssdeex", "clientSecret":"44FEEB98C23CC9FB5167502EA416877EB1CF62C530ABA640F14E4462F243D5","password":"D9dsfengev%"}';

    const returnCreds = getSFIntegrationCreds(
      'test.salesforce',
      'dummyClientId',
      'dummyUsername',
      dataStr
    );
    expect(returnCreds).to.be.not.empty;
    expect(returnCreds.clientId).to.eql('dummyClientId');
    expect(returnCreds.secretToken).to.eql('asbssdeex');
  });
});

describe('test encodeForm', () => {
  it('successful invoke', () => {
    const testData = {
      name: 'Jacky Chan',
      truth: '2>1'
    };
    const result = encodeForm(testData);
    expect(result).to.equal('name=Jacky%20Chan&truth=2%3E1');
  });
});

describe('test string sanitisation', () => {
  const sanitisedString = utils.sanitiseString(eventBodyBad);
  console.log('sanitisedString ' + sanitisedString + '\n');
  it('successful sanitisation', () => {
    expect(sanitisedString).to.equal(
      '{"name" : "&lt;script&gt;alert("xss");&lt;/script&gt;"}'
    );
  });
});
