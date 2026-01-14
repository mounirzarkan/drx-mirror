'use strict';

const {expect} = require('chai');
const responsePayloadConstructor = require('../../../src/constructor/responsePayloadConstructor.js');
const sinon = require('sinon');
const _ = require('lodash');

describe('SUITE: responsePayloadConstructor.', () => {
  it('CASE: getPayloadResponse returns defaultHeaders when passed undefined.', async () => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    sinon.stub(_, 'isEmpty').returns(true);
    const response = responsePayloadConstructor.getPayloadResponse(
      200,
      '{"success":true}',
      undefined
    );
    expect(response).to.deep.equal({
      statusCode: 200,
      body: '{"success":true}',
      headers: defaultHeaders
    });
  });

  it('CASE: getPayloadResponse returns object containing defaultHeaders and header object: {"X-API-Sample":"X-API-Sample"}.', async () => {
    sinon.stub(_, 'isEmpty').returns(false);

    const response = responsePayloadConstructor.getPayloadResponse(
      200,
      '{"success":true}',
      {'X-API-Sample': 'X-API-Sample'}
    );

    expect(response.headers['X-API-Sample']).to.equal('X-API-Sample');
    expect(response.headers['Content-Type']).to.equal('application/json');
    expect(response.headers['Access-Control-Allow-Origin']).to.equal('*');
  });

  it('CASE: getPayloadResponse returns object with overridden defaultHeader: "Access-Control-Allow-Origin" with "/".', async () => {
    sinon.stub(_, 'isEmpty').returns(false);

    const response = responsePayloadConstructor.getPayloadResponse(
      200,
      '{"success":true}',
      {'Access-Control-Allow-Origin': '/'}
    );

    expect(response.headers['Content-Type']).to.equal('application/json');
    expect(response.headers['Access-Control-Allow-Origin']).to.equal('/');
  });

  afterEach(() => {
    sinon.restore();
  });
});
