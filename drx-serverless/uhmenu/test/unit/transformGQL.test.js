const {expect} = require('chai');
//const sinon = require('sinon');
const transformGQL = require('../../src/transform/transformGQL.js');

describe('SUITE: transformGQL', () => {
  const transformedUHmenuConfigUSResponseStr = JSON.stringify(
    require('../mock/transformedUHmenuConfigUSResponse.json')
  );

  const uhMenuConfigUSResponseStr = JSON.stringify(
    require('../mock/uhMenuGraphQLresponse.json')
  );

  it('CASE: transformConfigurationResponse returns the transformed graphql response.', async () => {
    const result = transformGQL.transformConfigurationResponse(
      JSON.parse(uhMenuConfigUSResponseStr)
    );
    console.log(JSON.stringify(result));
    expect(result).to.deep.equal(
      JSON.parse(transformedUHmenuConfigUSResponseStr)
    );
  });

  // after(() => {
  //   sinon.restore();
  // });
});
