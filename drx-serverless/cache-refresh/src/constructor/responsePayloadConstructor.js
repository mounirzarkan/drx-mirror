'use restrict';

const _ = require('lodash');

function getPayloadResponse(_statusCode, _body, _headers) {
  const returnHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  if (!_.isEmpty(_headers)) {
    Object.assign(returnHeaders, _headers);
  }

  return {
    statusCode: _statusCode,
    body: _body,
    headers: returnHeaders
  };
}

module.exports = {
  getPayloadResponse
};
