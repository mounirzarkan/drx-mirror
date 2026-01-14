const axios = require('axios');
const log = require('./logUtil.js');
const awsAppConfig = require('./../../aws_app_config.json');

const CONFIG_PROFILE = {
  TEST_AUTOMATION: 'TEST_AUTOMATION',
  SERVICE_REQUESTS: 'SERVICE_REQUESTS'
};

const {appConfigUrl, IS_LOCAL} = process.env;

async function getConfig(profile, url) {
  log.debug('getConfig: - profile');
  log.debug(profile);

  log.debug('getConfig: - url');
  log.debug(url);

  if (!profile || typeof profile !== 'string') {
    throw new Error('Profile must be a string.');
  }

  const endpoint = `${url || appConfigUrl}/${profile}`;
  log.debug('appconfig endpoint: ');
  log.debug(endpoint);

  if (IS_LOCAL) {
    log.debug('Local Environment - loading aws_app_config.json: ');
    log.debug(awsAppConfig);
    return awsAppConfig;
  }

  try {
    const config = await axios.get(endpoint);
    log.debug('appconfig data: ');
    log.debug(config.data);

    return config.data;
  } catch (e) {
    log.debug('appconfig error: ');
    log.debug(e);
    return {};
  }
}

module.exports = {
  getConfig,
  CONFIG_PROFILE
};
