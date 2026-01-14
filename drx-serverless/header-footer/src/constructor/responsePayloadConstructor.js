'use restrict';

const _ = require('lodash');

function getTokenExchangeResponsePayload(token, expiresIn) {
  const response = {
    access_token: token,
    issued_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    token_type: 'Bearer',
    expires_in: expiresIn
  };
  return response;
}

function getTokenExchangeResponse(_statusCode, _body, _headers) {
  const returnHeaders = {
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
  getTokenExchangeResponsePayload,
  getTokenExchangeResponse
};
