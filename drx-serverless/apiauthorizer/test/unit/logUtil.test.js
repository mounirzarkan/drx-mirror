'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const {expect} = require('chai');
const log = require('../../src/util/logUtil.js');
const LOG_EVENTS = require('../../src/data/eventConstants.js');

const TEST_LOG_STRING_ERROR = 'test string ERROR';
const TEST_LOG_STRING_INFO = 'test string INFO';
const TEST_LOG_STRING_DEBUG = 'test string DEBUG';
const TEST_LOG_STRING_TRACE = 'test string TRACE';

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
describe('logUtil test', () => {
  describe('#handleLog, test log level - set as DEBUG', () => {
    beforeEach(() => {
      process.env.logLevel = 'DEBUG';
      sandbox.spy(console, 'log');
      sandbox.spy(console, 'info');
      sandbox.spy(console, 'debug');
      sandbox.spy(console, 'trace');
      sandbox.spy(console, 'error');
    });
    it('should log "invalid essential log event input" when not pass in predefined event for essential log.', () => {
      log.handleLog('ESSENTIAL', 'testInvalidEvent');
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).to.equal(
        'invalid essential log event input'
      );
    });
    it('should log proper event when pass in predefined event for essential log.', () => {
      log.handleLog('ESSENTIAL', LOG_EVENTS.API_START);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).to.equal(
        JSON.stringify(LOG_EVENTS.API_START)
      );
    });
    it('should log test string when pass in debug log.', () => {
      log.handleLog('DEBUG', TEST_LOG_STRING_DEBUG);
      expect(console.debug.calledOnce).to.be.true;
      expect(console.debug.getCall(0).args[0]).to.equal(
        JSON.stringify(TEST_LOG_STRING_DEBUG)
      );
    });
    it('should not log when pass in trace log.', () => {
      log.handleLog('TRACE', TEST_LOG_STRING_TRACE);
      expect(console.log.notCalled).to.be.true;
    });
    it('should log debug,error, info string when log debug, error, info, trace log.', () => {
      log.handleLog('DEBUG', TEST_LOG_STRING_DEBUG);
      log.handleLog('ERROR', TEST_LOG_STRING_ERROR);
      log.handleLog('INFO', TEST_LOG_STRING_INFO);
      log.handleLog('TRACE', TEST_LOG_STRING_TRACE);

      expect(console.debug.callCount).to.equal(1);
      expect(console.error.callCount).to.equal(1);
      expect(console.info.callCount).to.equal(1);
      expect(console.trace.callCount).to.equal(0);

      expect(console.debug.calledWith(JSON.stringify(TEST_LOG_STRING_DEBUG))).to
        .be.true;
      expect(console.error.calledWith(JSON.stringify(TEST_LOG_STRING_ERROR))).to
        .be.true;
      expect(console.info.calledWith(JSON.stringify(TEST_LOG_STRING_INFO))).to
        .be.true;
      expect(console.trace.calledWith(JSON.stringify(TEST_LOG_STRING_TRACE))).to
        .be.false;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test log level - set as INFO', () => {
    beforeEach(() => {
      process.env.logLevel = 'INFO';
      sandbox.spy(console, 'debug');
      sandbox.spy(console, 'error');
      sandbox.spy(console, 'info');
      sandbox.spy(console, 'trace');
    });
    it('should log debug,error, info string when log debug, error, info, trace log.', () => {
      log.handleLog('DEBUG', TEST_LOG_STRING_DEBUG);
      log.handleLog('ERROR', TEST_LOG_STRING_ERROR);
      log.handleLog('INFO', TEST_LOG_STRING_INFO);
      log.handleLog('TRACE', TEST_LOG_STRING_TRACE);
      expect(console.info.callCount).to.equal(1);

      expect(console.error.calledWith(JSON.stringify(TEST_LOG_STRING_ERROR))).to
        .be.true;
      expect(console.info.calledWith(JSON.stringify(TEST_LOG_STRING_INFO))).to
        .be.true;
      expect(console.trace.calledWith(JSON.stringify(TEST_LOG_STRING_TRACE))).to
        .be.false;
      expect(
        console.debug.neverCalledWith(JSON.stringify(TEST_LOG_STRING_DEBUG))
      ).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test log level - set as INFO', () => {
    beforeEach(() => {
      process.env.logLevel = 'INFO';
      sandbox.spy(console, 'info');
    });
    it('should log debug,error, info string when log debug, error, info, trace log.', () => {
      log.handleLog('INFO');
      expect(console.info.callCount).to.equal(1);
      expect(console.info.calledWith(JSON.stringify({}))).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test log level - no log level set', () => {
    beforeEach(() => {
      delete process.env.logLevel;
      sandbox.spy(console, 'debug');
      sandbox.spy(console, 'error');
      sandbox.spy(console, 'info');
      sandbox.spy(console, 'trace');
    });
    it('should log debug,error, info string when log debug, error, info, trace log.', () => {
      log.handleLog('DEBUG', TEST_LOG_STRING_DEBUG);
      log.handleLog('ERROR', TEST_LOG_STRING_ERROR);
      log.handleLog('INFO', TEST_LOG_STRING_INFO);
      log.handleLog('TRACE', TEST_LOG_STRING_TRACE);
      expect(console.error.calledWith(JSON.stringify(TEST_LOG_STRING_ERROR))).to
        .be.true;
      expect(console.info.calledWith(JSON.stringify(TEST_LOG_STRING_INFO))).to
        .not.be.true;
      expect(console.trace.calledWith(JSON.stringify(TEST_LOG_STRING_TRACE))).to
        .be.false;
      expect(
        console.debug.neverCalledWith(JSON.stringify(TEST_LOG_STRING_DEBUG))
      ).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test log level - set as invalidLevel', () => {
    beforeEach(() => {
      process.env.logLevel = 'invalidLevel';
      sandbox.spy(console, 'debug');
      sandbox.spy(console, 'error');
      sandbox.spy(console, 'info');
      sandbox.spy(console, 'trace');
    });
    it('should log debug,error, info string when log debug, error, info, trace log.', () => {
      log.handleLog('DEBUG', TEST_LOG_STRING_DEBUG);
      log.handleLog('ERROR', TEST_LOG_STRING_ERROR);
      log.handleLog('INFO', TEST_LOG_STRING_INFO);
      log.handleLog('TRACE', TEST_LOG_STRING_TRACE);
      expect(console.error.calledWith(JSON.stringify(TEST_LOG_STRING_ERROR))).to
        .be.true;
      expect(console.info.calledWith(JSON.stringify(TEST_LOG_STRING_INFO))).to
        .not.be.true;
      expect(console.trace.calledWith(JSON.stringify(TEST_LOG_STRING_TRACE))).to
        .be.false;
      expect(
        console.debug.neverCalledWith(JSON.stringify(TEST_LOG_STRING_DEBUG))
      ).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test mask, should mask', () => {
    beforeEach(() => {
      process.env.logLevel = 'DEBUG';
      sandbox.spy(console, 'debug');
      sandbox.replace(log, 'getSensitiveData', function () {
        return ['FIRSTNAME'];
      });
    });
    it('should mask firstname only.', () => {
      log.handleLog('DEBUG', testData);
      expect(console.debug.calledOnce).to.be.true;
      expect(console.debug.getCall(0).args[0]).to.include(
        JSON.stringify(log.MASK_WORDING)
      );
      expect(console.debug.getCall(0).args[0]).to.not.include('testFirstName');
      expect(console.debug.getCall(0).args[0]).to.not.include('firstRecipient');
      expect(console.debug.getCall(0).args[0]).to.not.include(
        'secondRecipientFirstName'
      );
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test mask, should not mask', () => {
    beforeEach(() => {
      process.env.logLevel = 'TRACE';
      sandbox.spy(console, 'trace');
      sandbox.replace(log, 'getSensitiveData', function () {
        return ['FIRSTNAME'];
      });
    });
    it('should mask firstname only.', () => {
      log.handleLog('TRACE', testData);
      expect(console.trace.calledOnce).to.be.true;
      expect(console.trace.getCall(0).args[0]).to.not.include(
        JSON.stringify(log.MASK_WORDING)
      );
      expect(console.trace.getCall(0).args[0]).to.include('testFirstName');
      expect(console.trace.getCall(0).args[0]).to.include('firstRecipient');
      expect(console.trace.getCall(0).args[0]).to.include(
        'secondRecipientFirstName'
      );
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe.skip('#handleLog, test mask, should mask firstName, age', () => {
    beforeEach(() => {
      process.env.logLevel = 'DEBUG';
      sandbox.replace(log, 'getSensitiveData', function () {
        return ['FIRSTNAME', 'AGE'];
      });
      sandbox.spy(console, 'log');
    });
    it('should mask firstname and age.', () => {
      console.info(log.getSensitiveData());
      log.handleLog('DEBUG', testData);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.getCall(0).args[0]).to.include(
        JSON.stringify(log.MASK_WORDING)
      );
      expect(console.log.getCall(0).args[0]).to.not.include('testFirstName');
      expect(console.log.getCall(0).args[0]).to.not.include('firstRecipient');
      expect(console.log.getCall(0).args[0]).to.not.include(
        'secondRecipientFirstName'
      );
      expect(console.log.getCall(0).args[0]).to.not.include(23);
      expect(console.log.getCall(0).args[0]).to.not.include(40);
      expect(console.log.getCall(0).args[0]).to.not.include(30);
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#handleLog, test mask, should not mask', () => {
    beforeEach(() => {
      process.env.logLevel = 'TRACE';
      sandbox.spy(console, 'trace');
      sandbox.replace(log, 'getSensitiveData', function () {
        return ['FIRSTNAME', 'AGE'];
      });
    });
    it('should mask firstname only.', () => {
      log.handleLog('TRACE', testData);
      expect(console.trace.calledOnce).to.be.true;
      expect(console.trace.getCall(0).args[0]).to.not.include(
        JSON.stringify(log.MASK_WORDING)
      );
      expect(console.trace.getCall(0).args[0]).to.include('testFirstName');
      expect(console.trace.getCall(0).args[0]).to.include('firstRecipient');
      expect(console.trace.getCall(0).args[0]).to.include(
        'secondRecipientFirstName'
      );
      expect(console.trace.getCall(0).args[0]).to.include(30);
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#test log, catch error - logLevel:error.', () => {
    beforeEach(() => {
      process.env.logLevel = 'ERROR';
      sandbox.spy(console, 'log');
      sandbox.stub(_, 'cloneDeep').throws(new Error('testStubError'));
    });
    it('should print "caught error while log error"', () => {
      log.error(TEST_LOG_STRING_ERROR);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith('caught error while log error')).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#test log, catch error.', () => {
    beforeEach(() => {
      process.env.logLevel = 'INFO';
      sandbox.spy(console, 'log');
      sandbox.stub(_, 'cloneDeep').throws(new Error('testStubError'));
    });
    it('should print "caught error while log info"', () => {
      log.info(TEST_LOG_STRING_INFO);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith('caught error while log info')).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#test log, catch error.', () => {
    beforeEach(() => {
      process.env.logLevel = 'DEBUG';
      sandbox.spy(console, 'log');
      sandbox.stub(_, 'cloneDeep').throws(new Error('testStubError'));
    });
    it('should print "caught error while log debug"', () => {
      log.debug(TEST_LOG_STRING_DEBUG);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith('caught error while log debug')).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#test log, catch error.', () => {
    beforeEach(() => {
      process.env.logLevel = 'TRACE';
      sandbox.spy(console, 'log');
      sandbox.stub(_, 'cloneDeep').throws(new Error('testStubError'));
    });
    it('should print "caught error while log trace"', () => {
      log.trace(TEST_LOG_STRING_TRACE);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith('caught error while log trace')).to.be.true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
  describe('#test log, catch error.', () => {
    beforeEach(() => {
      process.env.logLevel = 'ERROR';
      sandbox.spy(console, 'log');
      sandbox.stub(_, 'includes').throws(new Error('testStubError'));
    });
    it('should print "caught error while log essential"', () => {
      log.essential(LOG_EVENTS.API_START);
      expect(console.log.calledOnce).to.be.true;
      expect(console.log.calledWith('caught error while log essential')).to.be
        .true;
    });
    afterEach(() => {
      sandbox.restore();
      delete process.env.logLevel;
    });
  });
});
