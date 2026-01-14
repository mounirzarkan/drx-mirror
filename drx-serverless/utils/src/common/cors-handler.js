'use strict';
const {log} = require('./utils/index.js');

module.exports.handleRequest = async (event) => {
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
  return response;
};
