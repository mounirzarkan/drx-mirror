'use strict';

const {expect} = require('chai');
const {scMapper} = require('../../src/mappers/scMapper.js');

describe('SUITE: scMapper', () => {
  const headerGQLresponseStr = JSON.stringify(
    require('../mock/headerGQLresponse.json')
  );
  const footerGQLresponseStr = JSON.stringify(
    require('../mock/footerGQLresponse.json')
  );
  const scMapperExpectedResponseStr = JSON.stringify(
    require('../mock/scMapperExpectedResponse.json')
  );
  it('transform header and footer into expected response.', async () => {
    const countryCode = 'us';
    const languageCode = 'en';
    const scResp = {
      header: JSON.parse(headerGQLresponseStr).item,
      footer: JSON.parse(footerGQLresponseStr).item
    };

    const mappedData = scMapper(scResp, countryCode, languageCode);
    expect(mappedData).to.deep.equal(JSON.parse(scMapperExpectedResponseStr));
  });
});
