'use strict';
const logUtil = require('./util/logUtil.js');

module.exports.handleRequest = async (event) => {
  logUtil.trace('event: ');
  logUtil.trace(event);
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
  logUtil.trace('response: ');
  logUtil.trace(response);
  return response;
};
