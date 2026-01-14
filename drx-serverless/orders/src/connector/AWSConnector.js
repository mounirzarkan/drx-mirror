'use strict';

const {
  SecretsManagerClient,
  GetSecretValueCommand
} = require('@aws-sdk/client-secrets-manager');
const _ = require('lodash');
const log = require('../util/logUtil.js');

async function getSecret(region, secretName) {
  if (_.isNil(secretName) || _.isNil(region)) {
    throw new Error('parameter not define');
  }

  const client = new SecretsManagerClient({region});

  const resp = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: 'AWSCURRENT'
    })
  );

  log.debug('getSecret, resp:');
  log.debug(resp);
  return resp.SecretString;
}

module.exports = {getSecret};
