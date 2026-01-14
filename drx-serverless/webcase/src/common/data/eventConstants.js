'use strict';

let constants = {
  REDIS_ERROR: {
    result: 'ERROR',
    reason: 'REDIS_ERROR'
  },
  AWS_SECRET_FAIL: {
    result: 'ERROR',
    reason: 'AWS_SECRET_MANGERMENT_FAIL'
  },
  API_START: {
    result: 'RECORD',
    reason: 'API_AUTHORIZER_START'
  }
};
module.exports = Object.freeze(constants);
