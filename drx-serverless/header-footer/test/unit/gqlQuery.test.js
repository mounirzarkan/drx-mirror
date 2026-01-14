'use strict';
const {expect} = require('chai');
const {getFooterQuery, getHeaderQuery} = require('../../src/data/gqlQuery.js');

describe('SUITE: gqlQuery.', () => {
  it('CASE: getHeaderQuery returns gql string', async () => {
    const result = getHeaderQuery();
    expect(result).to.be.a('string');
  });
  it('CASE: getFooterQuery returns gql string', async () => {
    const result = getFooterQuery();
    expect(result).to.be.a('string');
  });
});
