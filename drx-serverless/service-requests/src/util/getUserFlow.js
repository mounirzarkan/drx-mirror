const log = require('./logUtil.js');

const USER_FLOW = {
  LAMBDA_MOCK: 'lambdaMock',
  SAGE: 'sage',
  DEFAULT: 'sf'
};

async function getUserFlow(config, cochlearId, countryCode) {
  log.debug('getUserFlow: - config');
  log.debug(config);

  log.debug('getUserFlow: - cochlearId');
  log.debug(cochlearId);

  log.debug('getUserFlow: - countryCode');
  log.debug(countryCode);

  if (!config || !cochlearId || !countryCode) {
    throw new Error('Missing parameters.');
  }

  const {successUsers, features} = config;

  const lambdaMockUsers = successUsers?.lambdaMock?.orders;
  log.debug('getUserFlow: - lambdaMockUsers');
  log.debug(lambdaMockUsers);

  const lambdaMockUser = lambdaMockUsers?.find(
    (user) => user.cid === cochlearId
  );

  if (lambdaMockUser) {
    log.debug('getUserFlow: - Lambda Mock');
    return USER_FLOW.LAMBDA_MOCK;
  }

  const sageUsers = successUsers?.sage?.orders;
  log.debug('getUserFlow: - sageUsers');
  log.debug(sageUsers);

  const sageUser = sageUsers?.find((user) => user.cid === cochlearId);

  if (sageUser) {
    log.debug('getUserFlow: - sage via user match');
    return USER_FLOW.SAGE;
  }

  const sageEnabled = features?.sage?.enabled;
  log.debug('getUserFlow: - sageEnabled');
  log.debug(sageEnabled);

  const isActiveCountry = features?.sage?.countryCode[countryCode];
  log.debug('getUserFlow: - isActiveCountry');
  log.debug(isActiveCountry);

  if (sageEnabled && isActiveCountry) {
    log.debug('getUserFlow: - sage via country rollout');
    return USER_FLOW.SAGE;
  }

  return USER_FLOW.DEFAULT;
}

module.exports = {
  getUserFlow,
  USER_FLOW
};
