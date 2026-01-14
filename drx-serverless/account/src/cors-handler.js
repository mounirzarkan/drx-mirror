'use strict';
const {log: logUtil} = require('./util/index');

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
  return response;
};
