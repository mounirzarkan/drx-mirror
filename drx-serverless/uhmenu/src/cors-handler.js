'use strict';
const log = require('./util/logUtil.js');

module.exports.handleRequest = async (event) => {
  log.debug(`In CorsUHmenuFunction`);
  log.trace('event: ');
  log.trace(event);
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': process.env.corsAllowedHeaders,
      'Access-Control-Allow-Origin': process.env.corsOrigin,
      'Access-Control-Allow-Methods': process.env.corsAllowedMethods,
      'Access-Control-Max-Age': parseInt(process.env.corsMaxAge, 10)
    },
    body: ''
  };
  log.debug('response: ');
  log.debug(response);
  return response;
};
