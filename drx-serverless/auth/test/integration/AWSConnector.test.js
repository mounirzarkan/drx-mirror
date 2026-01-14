'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const {AWSConnector} = require('../../src/connector/index.js');

const sandbox = sinon.createSandbox();

describe('test getSecret method', () => {
  it('should return proper secret value.', (done) => {
    const dataStr =
      '{ "Name": "dev/drx/sf/integration", "SecretString": "{\\"secret\\":\\"dummySecret123\\",\\"clientSecret\\":\\"44FEEB98C23CC9FB5167502EA416877EB1CF62C530ABA640F14E4462F243D5\\",\\"password\\":\\"D9dsfengev%\\"}" }';
    const dataJson = JSON.parse(dataStr);
    sandbox.stub(AWSConnector, 'getSecret').returns(dataJson);
    const result = AWSConnector.getSecret(process.env.region, 'secretName1');
    expect(JSON.parse(result.SecretString).secret).to.eql('dummySecret123');
    done();
  });

  it('should reject with error', (done) => {
    sandbox.stub(AWSConnector, 'getSecret').rejects('error while calling aws');
    const result = AWSConnector.getSecret(process.env.region, 'secretName2');
    result.catch((err) => {
      expect(err).to.eq('Failed retrieve sf secret from Secrets Manager');
      done();
    });
  });
});

describe('test input param', () => {
  it('should return parameter not define message if input is null', () => {
    AWSConnector.getSecret({}, null).catch((rejectValue) => {
      expect(rejectValue).to.eql('parameter not define');
    });
  });

  it('input not define', () => {
    AWSConnector.getSecret({}).catch((rejectValue) => {
      expect(rejectValue).to.eql('parameter not define');
    });
  });
});

afterEach(() => {
  sandbox.restore();
});
