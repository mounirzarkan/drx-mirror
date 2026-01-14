'use strict';

const log = require('./util/logUtil.js');

async function getSecret(secretsManager, secretName) {
  return new Promise(function (resolve, reject) {
    if (secretName === undefined || secretName === null) {
      reject('parameter not define');
    }

    const params = {
      SecretId: secretName
    };
    secretsManager.getSecretValue(params, function (err, data) {
      if (err) {
        log.error('Failed retrieve sf secret from Secrets Manager');
        log.error(err);
        reject('Failed retrieve sf secret from Secrets Manager');
      }
      resolve(data.SecretString);
    });
  });
}
module.exports = {
  getSecret
};
