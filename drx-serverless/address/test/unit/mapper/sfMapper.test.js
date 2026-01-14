const sinon = require('sinon');
const {expect} = require('chai');
const {sfMapper} = require('../../../src/mapper/index.js');
describe('SUITE: sfMapper', () => {
  const sfGetAddressResponseStr = JSON.stringify(
    require('../../mock/sfGetAddressResponse.json')
  );
  const filteredAddressStr = JSON.stringify({
    customerIdentifier: '162748173278165',
    addressId: 'a0H7Y000005GBX4UAO',
    street1: '33 fdoe Ttu',
    street2: null,
    street3: null,
    street4: null,
    city: 'ddock',
    state: 'TX',
    postalCode: '79406-0016',
    countryIso2Code: 'US'
  });
  it('CASE: sfAddressMapper with sfGetAddressResponse returns filtered address obj', () => {
    const resp = sfMapper.sfAddressMapper(
      JSON.parse(sfGetAddressResponseStr),
      'Recipient'
    );
    expect(resp).to.deep.equal(JSON.parse(filteredAddressStr));
  });
  afterEach(() => {
    sinon.restore();
  });
});
