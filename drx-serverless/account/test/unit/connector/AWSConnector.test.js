const {expect} = require('chai');
const sinon = require('sinon');
const {SecretsManagerClient} = require('@aws-sdk/client-secrets-manager');
const AWSConnector = require('../../../src/connector/AWSConnector.js');

describe('SUITE: AWSConnector', () => {
  let stub;

  beforeEach(() => {
    stub = sinon.stub(SecretsManagerClient.prototype, 'send');
  });

  afterEach(() => {
    stub.restore();
  });

  it('CASE: should throw an error if region or secretName is not defined', async () => {
    try {
      await AWSConnector.getSecret(null, 'secretName');
      expect.fail('Expected error was not thrown');
    } catch (err) {
      expect(err.message).to.equal('parameter not define');
    }

    try {
      await AWSConnector.getSecret('region', null);
      expect.fail('Expected error was not thrown');
    } catch (err) {
      expect(err.message).to.equal('parameter not define');
    }
  });

  it('CASE: should return the secret string', async () => {
    const secretString = 'secret';
    stub.resolves({SecretString: secretString});

    const result = await AWSConnector.getSecret('region', 'secretName');

    expect(result).to.equal(secretString);
  });
});
