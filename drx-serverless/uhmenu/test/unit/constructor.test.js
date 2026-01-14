'use strict';

const {expect} = require('chai');
const responsePayloadConstructor = require('../../src/constructor/responsePayloadConstructor.js');

describe('SUITE: responsePayloadConstructor.', () => {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers':
      'content-length, content-type,date,status,x-amzn-remapped-authorization, Access-Control-Allow-Origin,Access-Control-Expose-Headers'
  };

  it('CASE: getResponseHeaders returns defaultHeaders when passed undefined.', async () => {
    const responseHeaders =
      responsePayloadConstructor.getResponseHeaders(undefined);
    expect(responseHeaders).to.deep.equal(defaultHeaders);
  });

  it('CASE: getResponseHeaders returns object containing defaultHeaders and {"X-API-Sample":"X-API-Sample"}.', async () => {
    const responseHeaders = responsePayloadConstructor.getResponseHeaders({
      'X-API-Sample': 'X-API-Sample'
    });
    expect(responseHeaders).to.deep.equal({
      ...defaultHeaders,
      ...{'X-API-Sample': 'X-API-Sample'}
    });
  });

  it('CASE: getResponseHeaders returns object with one of the defaultHeaders overridden by {"Access-Control-Allow-Origin": "*"}.', async () => {
    const responseHeaders = responsePayloadConstructor.getResponseHeaders({
      'Access-Control-Allow-Origin': '/path'
    });
    expect(responseHeaders).to.deep.equal({
      ...defaultHeaders,
      ...{'Access-Control-Allow-Origin': '/path'}
    });
  });

  it('CASE: getResponseObj has properties statusCode,body,headers.', async () => {
    const responseObj = responsePayloadConstructor.getResponseObj(
      200,
      JSON.stringify({data: 'data response'}),
      {'X-Header': 'X-Header-Value'}
    );
    expect(responseObj).to.haveOwnProperty('statusCode');
    expect(responseObj).to.haveOwnProperty('body');
    expect(responseObj).to.haveOwnProperty('headers');
  });

  it('CASE: getResponseObj has statusCode property === "200".', async () => {
    const responseObj = responsePayloadConstructor.getResponseObj(
      '200',
      JSON.stringify({data: 'data response'}),
      {'X-Header': 'X-Header-Value'}
    );
    expect(responseObj.statusCode).to.equal('200');
  });

  it('CASE: getResponseObj has body property === "{"data":"data response"}".', async () => {
    const responseObj = responsePayloadConstructor.getResponseObj(
      '200',
      JSON.stringify({data: 'data response'}),
      {'X-Header': 'X-Header-Value'}
    );
    expect(responseObj.body).to.equal('{"data":"data response"}');
  });

  it('CASE: getResponseObj has headers property deep equal to {"X-Header":"X-Header-Value"}.', async () => {
    const responseObj = responsePayloadConstructor.getResponseObj(
      '200',
      JSON.stringify({data: 'data response'}),
      {'X-Header': 'X-Header-Value'}
    );
    expect(responseObj.headers).to.deep.equal({'X-Header': 'X-Header-Value'});
  });

  it('CASE: getErrorResponse returns object with properties: success,errors.', async () => {
    const responseObj = responsePayloadConstructor.getErrorResponse(
      true,
      'title',
      'errorCode',
      'detail'
    );
    expect(responseObj).to.haveOwnProperty('success');
    expect(responseObj).to.haveOwnProperty('errors');
  });

  it('CASE: getErrorResponse errors property is an array.', async () => {
    const responseObj = responsePayloadConstructor.getErrorResponse(
      true,
      'title',
      'errorCode',
      'detail'
    );
    expect(Array.isArray(responseObj.errors)).to.be.true;
  });

  it('CASE: getErrorResponse errors array has a length ===1.', async () => {
    const responseObj = responsePayloadConstructor.getErrorResponse(
      true,
      'title',
      'errorCode',
      'detail'
    );
    expect(responseObj.errors.length).to.equal(1);
  });

  it('CASE: getErrorResponse errors[0] is deep equal to {title,errorCode,detail}.', async () => {
    const responseObj = responsePayloadConstructor.getErrorResponse(
      true,
      'title',
      'errorCode',
      'detail'
    );

    const errorItem = responseObj.errors[0];
    expect(errorItem).to.haveOwnProperty('title');
    expect(errorItem).to.haveOwnProperty('errorCode');
    expect(errorItem).to.haveOwnProperty('detail');

    expect(errorItem.title).to.equal('title');
    expect(errorItem.errorCode).to.equal('errorCode');
    expect(errorItem.detail).to.equal('detail');
  });

  it('CASE: getUHmenuDataResponse has properties: success,data.', async () => {
    const responseObj = responsePayloadConstructor.getUHmenuDataResponse(
      true,
      []
    );
    expect(responseObj).to.haveOwnProperty('success');
    expect(responseObj).to.haveOwnProperty('data');
  });

  it('CASE: getUHmenuDataResponse data property contains uhmenu property.', async () => {
    const responseObj = responsePayloadConstructor.getUHmenuDataResponse(
      true,
      []
    );
    expect(responseObj.data).to.haveOwnProperty('uhmenu');
  });

  it('CASE: getUHmenuDataResponse expects uhmenu to be an array.', async () => {
    const responseObj = responsePayloadConstructor.getUHmenuDataResponse(
      true,
      []
    );
    expect(Array.isArray(responseObj.data.uhmenu)).to.be.true;
  });
});
