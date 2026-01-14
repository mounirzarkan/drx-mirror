'use restrict';

const _ = require('lodash');

function getResponseHeaders(_headers) {
  const returnHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers':
      'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
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

function getUHmenuDataResponse(success, headerList) {
  return {
    success,
    data: {
      uhmenu: headerList
    }
  };
}

module.exports = {
  getResponseObj,
  getErrorResponse,
  getUHmenuDataResponse,
  getResponseHeaders
};
