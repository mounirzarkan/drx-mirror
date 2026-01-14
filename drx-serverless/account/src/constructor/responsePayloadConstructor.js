'use restrict';

const _ = require('lodash');

function getResponseHeaders(_headers) {
  const returnHeaders = {
    'Access-Control-Allow-Origin': '*'
  };

  if (!_.isEmpty(_headers)) {
    Object.assign(returnHeaders, _headers);
  }
  return returnHeaders;
}

function getResponseObj(_statusCode, _body, _headers) {
  return {
    statusCode: _statusCode,
    body: _body,
    headers: _headers
  };
}

function getResponse(statusCode, body, headers) {
  const _headers = getResponseHeaders(headers);
  return getResponseObj(statusCode, body, _headers);
}

function getErrorResponse(success, title, errorCode, detail) {
  return {
    success,
    errors: [
      {
        title,
        errorCode,
        detail
      }
    ]
  };
}

module.exports = {
  getResponse,
  getResponseObj,
  getErrorResponse,
  getResponseHeaders
};
