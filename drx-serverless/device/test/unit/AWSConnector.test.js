'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const AWS = require('aws-sdk');
const AWSConnect = require('../../src/AWSConnector');

const sandbox = sinon.createSandbox();

describe('test getSecret method', () => {
  let secretsManager;
  beforeEach(() => {
    process.env.region = 'ap-southeast-2';
    secretsManager = new AWS.SecretsManager({
      region: process.env.region
    });
  });
  it('should return proper secret value.', (done) => {
    // prettier-ignore
    const dataStr = '{ "Name": "dev/drx/sf/integration", "SecretString": { "secret": "dummySecret123", "clientSecret":"44FEEB98C23CC9FB5167502EA416877EB1CF62C530ABA640F14E4462F243D5","password":"D9dsfengev%"} }';

    const dataJson = JSON.parse(dataStr);
    sandbox.stub(secretsManager, 'getSecretValue').yields(null, dataJson);
    const result = AWSConnect.getSecret(secretsManager, 'secretName1');
    result
      .then((data) => {
        expect(data.secret).to.eql('dummySecret123');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('should reject with error', () => {
    sandbox.stub(secretsManager, 'getSecretValue').yields(
      {
        message: 'error while calling aws'
      },
      null
    );
    const result = AWSConnect.getSecret(secretsManager, 'secretName2');
    result.catch((err) => {
      expect(err).to.eq('Failed retrieve sf secret from Secrets Manager');
    });
  });
});

describe('test input param', () => {
  it('should return parameter not define message if input is null', () => {
    AWSConnect.getSecret({}, null).catch((rejectValue) => {
      expect(rejectValue).to.eql('parameter not define');
    });
  });
  it('input not define', () => {
    AWSConnect.getSecret({}).catch((rejectValue) => {
      expect(rejectValue).to.eql('parameter not define');
    });
  });
});

afterEach(() => {
  // Restore the default sandbox here
  sandbox.restore();
});
