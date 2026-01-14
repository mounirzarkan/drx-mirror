const log = require('./logUtil.js');

const USER_FLOW = {
  LAMBDA_MOCK: 'lambdaMock',
  SAGE_MOCK: 'sageMock',
  SAGE: 'sage',
  DEFAULT: 'sf'
};

async function getUserFlow(config, cochlearId) {
  log.debug('getUserFlow: - cochlearId');
  log.debug(cochlearId);

  if (!config || !cochlearId) {
    throw new Error('Invalid config or cochlearId.');
  }

  let userFlowType = USER_FLOW.DEFAULT;

  const {successUsers} = config;

  const lambdaMockUsers = successUsers?.lambdaMock?.serviceRequests;
  log.debug('getUserFlow: - lambdaMockUsers');
  log.debug(lambdaMockUsers);

  const sageMockUsers = successUsers?.sageMock?.serviceRequests;
  log.debug('getUserFlow: - sageMockUsers');
  log.debug(sageMockUsers);

  const sageUsers = successUsers?.sage?.serviceRequests;
  log.debug('getUserFlow: - sageUsers');
  log.debug(sageUsers);

  const lambdaMockUser = lambdaMockUsers?.find(
    (user) => user.cid === cochlearId
  );

  if (lambdaMockUser) {
    log.debug('getUserFlow: - Lambda Mock');
    return USER_FLOW.LAMBDA_MOCK;
  }

  const sageMockUser = sageMockUsers?.find((user) => user.cid === cochlearId);

  if (sageMockUser) {
    log.debug('getUserFlow: - SAGE Mock');
    return USER_FLOW.SAGE_MOCK;
  }

  const sageUser = sageUsers?.find((user) => user.cid === cochlearId);

  if (sageUser) {
    log.debug('getUserFlow: - SAGE');
    return USER_FLOW.SAGE;
  }

  log.debug('getUserFlow: - SF');
  log.debug(userFlowType);

  return userFlowType;
}

module.exports = {
  getUserFlow,
  USER_FLOW
};
