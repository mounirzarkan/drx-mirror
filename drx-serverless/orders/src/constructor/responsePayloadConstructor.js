'use restrict';

const _ = require('lodash');

function getResponse(_statusCode, _body, _headers) {
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

function getDataObj(dataObj) {
  console.log('dataObj');
  console.log(dataObj);
  return {
    success: true,
    data: {
      ...dataObj
    }
  };
}

module.exports = {
  getResponse,
  getDataObj
};
