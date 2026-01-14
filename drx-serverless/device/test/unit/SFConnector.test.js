'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const {SFConnector} = require('../../src/connector/index.js');
const {getToken} = SFConnector;

describe.skip('SFConnector test connect.', () => {
  let sandbox;
  let ConnectionSub;
  let constructorStub;
  let ConnectInitializer;
  let SFConnector;

  beforeEach('set up sandbox.', () => {
    sandbox = sinon.createSandbox();
    ConnectionSub = {
      login: sandbox.spy()
    };
    constructorStub = sandbox.stub().returns(ConnectionSub);
    ConnectInitializer = sandbox
      .stub({}, 'constructor')
      .callsFake(constructorStub);
    SFConnector = proxyquire('../../src/connector/SFConnector.js', {
      Connection: ConnectInitializer
    });
  });
  afterEach('clean up.', () => {
    sandbox.restore();
    ConnectionSub = null;
    // Restore the default sandbox here
    sinon.restore();
  });
  describe('#loginConnect', () => {
    it('Connection constructor should be called. ', () => {
      SFConnector.loginConnect(sandbox.fake());
      expect(constructorStub.called);
    });
  });
  describe('#tokenConnect', () => {
    it('Connection constructor will be called', () => {
      SFConnector.tokenConnect(sandbox.fake());
      expect(constructorStub.called);
    });
  });
});

describe.skip('SFConnector test login.', () => {
  it('#getToken', () => {
    const creds = {
      username: 'testUser',
      password: 'pass',
      secretToken: 'token'
    };
    const jsConnect = {
      login: async function (username, password) {
        this.instanceUrl = 'testUrl';
        this.accessToken = 'testToken';
        expect(username).equal('testUser');
        expect(password).equal('passtoken');
      }
    };

    getToken(jsConnect, creds).then((data) => {
      expect(data).to.be.not.null;
      expect(data.instanceUrl).equal('testUrl');
      expect(data.accessToken).equal('testToken');
    });
  });
});

describe.skip('SFConnector getDevicesList', () => {
  it('#getDevicesList', async () => {
    const axiosFake = sinon.fake.resolves({data: 'data'});
    const SFConnector = proxyquire('../../src/SFConnector.js', {
      axios: axiosFake
    });
    const responseData = await SFConnector.getDevicesList('dummyid', {
      instanceUrl: 'url',
      accessToken: 'at'
    });
    expect(responseData).equal('data');
  });
});
