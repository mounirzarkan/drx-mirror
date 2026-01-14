'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const log = require('../../src/util/logUtil.js');
const awsConnector = require('../../src/connector/AWSConnector.js');
const constructor = require('../../src/constructor/responsePayloadConstructor.js');

const utils = require('../../src/util/utils.js');
const cacheRefreshController = require('../../src/controller/cacheRefreshController.js');
const handler = require('../../src/handler.js');
const _ = require('lodash');

const testRunController = require('../../src/controller/testRunController.js');

describe.skip('SUITE: handler.deleteCache', () => {
  beforeEach(() => {
    process.env = {
      Environment: 'Environment',
      region: 'region',
      secretName: 'secretName',
      RedisPort: 'RedisPort',
      RedisHostname: 'RedisHostname'
    };

    sinon
      .stub(awsConnector, 'getSecret')
      .resolves('{"redisToken":"redisToken"}');
    sinon.stub(log, 'debug').returns(undefined);
    sinon.stub(_, 'toLower').returns('environment');
  });

  it("CASE: deleteCache('appName') returns 204 successfulResp", async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName'
      }
    };

    const successfulResp = JSON.stringify({
      statusCode: '204',
      body: undefined,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

    const isValidNameStub = sinon.stub();
    isValidNameStub.onCall(0).returns(true);
    isValidNameStub.onCall(1).returns(false);
    sinon.replace(cacheRefreshController, 'deleteCache', () => [
      [null, 12],
      [null, 12]
    ]);
    sinon
      .stub(constructor, 'getPayloadResponse')
      .returns(JSON.parse(successfulResp));

    const resp = await handler.deleteCache(event);

    expect(constructor.getPayloadResponse.getCall(0)).not.undefined;
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.equal('204');
    expect(resp.statusCode).to.equal('204');
    expect(resp).to.deep.equal(JSON.parse(successfulResp));
  });

  it("CASE: deleteCache('appName','logicName') returns 204 successfulResp", async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName',
        logicName: 'logicName'
      }
    };

    const successfulResp = JSON.stringify({
      statusCode: '204',
      body: undefined,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

    const isValidNameStub = sinon.stub();
    isValidNameStub.onCall(0).returns(true);
    isValidNameStub.onCall(1).returns(true);
    sinon.replace(utils, 'isValidName', isValidNameStub);

    sinon.replace(cacheRefreshController, 'deleteCache', () => [
      [null, 12],
      [null, 12]
    ]);
    sinon
      .stub(constructor, 'getPayloadResponse')
      .returns(JSON.parse(successfulResp));

    const resp = await handler.deleteCache(event);

    expect(constructor.getPayloadResponse.getCall(0)).not.undefined;
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.equal('204');

    expect(resp.statusCode).to.equal('204');
    expect(resp).to.deep.equal(JSON.parse(successfulResp));
  });

  it("CASE: deleteCache('appName') throws error and returns 500 error response.", async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName'
      }
    };

    const internalServerErrorResp = JSON.stringify({
      body: '{"message":"Internal Server Error"}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: '500'
    });

    const isValidNameStub = sinon.stub();
    isValidNameStub.onCall(0).returns(true);
    isValidNameStub.onCall(1).returns(true);
    sinon.replace(utils, 'isValidName', isValidNameStub);

    sinon.replace(cacheRefreshController, 'deleteCache', () => {
      throw new Error('500 Internal Server Error');
    });
    sinon
      .stub(constructor, 'getPayloadResponse')
      .returns(JSON.parse(internalServerErrorResp));

    const resp = await handler.deleteCache(event);

    expect(constructor.getPayloadResponse.getCall(0)).not.undefined;
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.equal('500');
    expect(resp.statusCode).to.equal('500');
    expect(resp).to.deep.equal(JSON.parse(internalServerErrorResp));
  });

  it("CASE: deleteCache('app*Name') returns 400 Bad Request response.", async () => {
    const event = {
      queryStringParameters: {
        appName: 'app*Name'
      }
    };

    const badRequestResponse = JSON.stringify({
      body: '{"message":"Invalid query string, requires parameter \'appName\' to contain only a-z, A-Z, 0-9 or \'-\' characters."}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: '400'
    });

    const isValidNameStub = sinon.stub();
    isValidNameStub.onCall(0).returns(false);
    isValidNameStub.onCall(1).returns(false);
    sinon.replace(utils, 'isValidName', isValidNameStub);

    sinon.replace(cacheRefreshController, 'deleteCache', () => {
      throw new Error('500 Internal Server Error');
    });
    sinon
      .stub(constructor, 'getPayloadResponse')
      .returns(JSON.parse(badRequestResponse));

    const resp = await handler.deleteCache(event);

    expect(constructor.getPayloadResponse.getCall(0)).not.undefined;
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.equal('400');

    expect(constructor.getPayloadResponse.getCall(0).args[1]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[1]).to.equal(
      '{"message":"Invalid query string, requires parameter \'appName\' to contain only a-z, A-Z, 0-9 or \'-\' characters."}'
    );

    expect(resp.statusCode).to.equal('400');
    expect(resp).to.deep.equal(JSON.parse(badRequestResponse));
  });

  it("CASE: deleteCache('app*Name') returns 400 Bad Request response.", async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName',
        logicName: 'logic*Name'
      }
    };

    const badRequestResponse = JSON.stringify({
      body: '{"message":"Invalid query string, requires parameter \'logicName\' to contain only a-z, A-Z, 0-9 or \'-\' characters."}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      statusCode: '400'
    });

    const isValidNameStub = sinon.stub();
    isValidNameStub.onCall(0).returns(true);
    isValidNameStub.onCall(1).returns(false);
    sinon.replace(utils, 'isValidName', isValidNameStub);

    sinon.replace(cacheRefreshController, 'deleteCache', () => {
      throw new Error('500 Internal Server Error');
    });
    sinon
      .stub(constructor, 'getPayloadResponse')
      .returns(JSON.parse(badRequestResponse));

    const resp = await handler.deleteCache(event);

    expect(constructor.getPayloadResponse.getCall(0)).not.undefined;
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[0]).to.equal('400');

    expect(constructor.getPayloadResponse.getCall(0).args[1]).to.be.a('string');
    expect(constructor.getPayloadResponse.getCall(0).args[1]).to.equal(
      '{"message":"Invalid query string, requires parameter \'logicName\' to contain only a-z, A-Z, 0-9 or \'-\' characters."}'
    );

    expect(resp.statusCode).to.equal('400');
    expect(resp).to.deep.equal(JSON.parse(badRequestResponse));
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe.skip('SUITE: handler.postTestRun', () => {
  beforeEach(() => {
    sinon
      .stub(awsConnector, 'getSecret')
      .resolves('{"redisToken":"redisToken"}');
  });

  it('CASE: postTestRun expects resp.statusCode to equal "200".', async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName'
      }
    };

    sinon.stub(testRunController, 'postSaveCache').returns({
      prevValue: 'none',
      saveTimeStr: 'timeStr',
      beforeDeleteCache: 'timeStr',
      appName: 'appName'
    });

    sinon.stub(testRunController, 'getCacheValue').returns(undefined);

    const resp = await handler.postTestRun(event);

    expect(resp).not.undefined;
    expect(resp.statusCode).to.equal('200');
  });

  it('CASE: postTestRun expects resp.body to equal "{"prevValue":"none","saveTimeStr":"timeStr","beforeDeleteCache":"timeStr","appName":"appName","afterDeleteCache":"none"}".', async () => {
    const event = {
      queryStringParameters: {
        appName: 'appName'
      }
    };

    sinon.stub(testRunController, 'postSaveCache').returns({
      prevValue: 'none',
      saveTimeStr: 'timeStr',
      beforeDeleteCache: 'timeStr',
      appName: 'appName'
    });

    sinon.stub(testRunController, 'getCacheValue').returns(undefined);

    const resp = await handler.postTestRun(event);

    expect(resp).not.undefined;
    expect(resp.body).to.equal(
      '{"prevValue":"none","saveTimeStr":"timeStr","beforeDeleteCache":"timeStr","appName":"appName","afterDeleteCache":"none"}'
    );
  });

  afterEach(() => {
    delete process.testCache;
    sinon.restore();
  });
});
