'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {log, stringifyUtil} = require('../../../src/common/utils/index');
const eventConstants = require('../../../src/common/data/eventConstants');
const _ = require('lodash');

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

const sandbox = sinon.createSandbox();

describe('SUITE: logUtil', () => {
  describe('#handlelog', () => {
    beforeEach(() => {
      sandbox.spy(stringifyUtil, 'stringifyWithMask');
      sandbox.replace(stringifyUtil, 'getSensitiveData', function () {
        return ['FIRSTNAME', 'AGE'];
      });
    });
    it('should mask sensitiveData.', () => {
      process.env.logLevel = 'DEBUG';
      log.handleLog('DEBUG', testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
      expect(stringifyUtil.stringifyWithMask.getCall(0).args[0]).is.true;
    });
    it('should not mask sensitiveData.', () => {
      process.env.logLevel = 'TRACE';
      log.handleLog('TRACE', testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
      console.log(stringifyUtil.stringifyWithMask.getCall(0));
      expect(stringifyUtil.stringifyWithMask.getCall(0).args[0]).is.false;
    });
    it('should not log', () => {
      process.env.logLevel = 'ERROR';
      log.handleLog('DEBUG', testData);

      expect(stringifyUtil.stringifyWithMask.notCalled).to.be.true;
    });
    it('should not log', () => {
      process.env.logLevel = 'ERROR';
      log.handleLog();

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.false;
    });
    it('should log nothing', () => {
      process.env.logLevel = 'TRACE';
      log.handleLog();

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
      expect(stringifyUtil.stringifyWithMask.getCall(0).args[0]).is.true;
      expect(stringifyUtil.stringifyWithMask.getCall(0).args[2]).to.be.empty;
    });
    it('should not log essential', () => {
      process.env.logLevel = 'DEBUG';
      sandbox.spy(JSON, 'stringify');
      sandbox.spy(console, 'log');
      log.handleLog('ESSENTIAL', 'test');

      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).eq(
        'invalid essential log event input'
      );
      expect(JSON.stringify.notCalled).to.be.true;
    });
    it('should log essential', () => {
      process.env.logLevel = 'DEBUG';
      sandbox.spy(JSON, 'stringify');
      sandbox.spy(console, 'log');
      log.handleLog('ESSENTIAL', eventConstants.API_START);

      expect(console.log.calledOnce).to.be.true;
      expect(JSON.stringify.calledOnce).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#different log leve', () => {
    beforeEach(() => {
      sandbox.spy(stringifyUtil, 'stringifyWithMask');
      sandbox.replace(stringifyUtil, 'getSensitiveData', function () {
        return ['FIRSTNAME', 'AGE'];
      });
    });
    it('should log debug', () => {
      process.env.logLevel = 'DEBUG';
      log.debug(testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
    });
    it('should not log debug', () => {
      process.env.logLevel = 'INFO';
      log.debug(testData);

      expect(stringifyUtil.stringifyWithMask.notCalled).to.be.true;
    });
    it('should log trace', () => {
      process.env.logLevel = 'TRACE';
      log.trace(testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
    });
    it('should not log debug', () => {
      process.env.logLevel = 'INFO';
      log.debug(testData);

      expect(stringifyUtil.stringifyWithMask.notCalled).to.be.true;
    });
    it('should log info', () => {
      process.env.logLevel = 'INFO';
      log.info(testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
    });
    it('should log error', () => {
      process.env.logLevel = 'INFO';
      log.error(testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
    });
    it('should log audit', () => {
      process.env.logLevel = 'ERROR';
      log.audit(testData);

      expect(stringifyUtil.stringifyWithMask.calledOnce).to.be.true;
    });
    it('should log ESSENTIAL', () => {
      process.env.logLevel = 'ERROR';
      log.essential(eventConstants.API_START);

      expect(stringifyUtil.stringifyWithMask.notCalled).to.be.true;
    });
    it('should log error log info if catch error during logging debug', () => {
      sandbox.replace(_, 'cloneDeep', function () {
        throw new Error();
      });
      sandbox.spy(console, 'log');

      log.debug(testData);

      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).eq('caught error while log debug');
    });
    it('should log error log info if catch error during logging audit', () => {
      sandbox.replace(_, 'cloneDeep', function () {
        throw new Error();
      });
      sandbox.spy(console, 'log');

      log.audit(testData);

      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).eq('caught error while log audit');
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
});
