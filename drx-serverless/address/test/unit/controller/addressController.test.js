const sinon = require('sinon');
const {expect} = require('chai');

const {AddressController} = require('../../../src/controller/index.js');
const {cryptography, USER_FLOW} = require('../../../src/util/index.js');

describe('SUITE: AddressController', () => {
  const userFlow = USER_FLOW.DEFAULT;
  let addressController = undefined;
  const configStr = JSON.stringify({
    scEndpoint: 'scEndpoint',
    sfHostname: 'sfHostname',
    sfClientId: 'sfClientId',
    sfUserName: 'sfUserName',
    secret: {
      scp_env_username: 'scp_env_username',
      scp_env_password: 'scp_env_password',
      sc_apikey: 'sc_apikey'
    },
    _env: 'DEV',
    userSessionSeconds: 7200,
    userSessionPrefix: 'drx-dev-'
    // cache: {get: function() {}, save: function() {}},
  });

  const decoratedAddressStr = JSON.stringify({
    _metadata: {readOnlyForm: false},
    addressId: {value: 'a0H7Y000005GBX4UAO', permission: 'rw'},
    street1: {value: '33 fdoe Ttu', permission: 'rw'},
    street2: {value: null, permission: 'rw'},
    street3: {value: null, permission: 'rw'},
    street4: {value: null, permission: 'rw'},
    city: {value: 'ddock', permission: 'rw'},
    state: {value: 'TX', permission: 'rw'},
    postalCode: {value: '79406-0016', permission: 'rw'},
    countryIso2Code: {value: 'US', permission: 'r'}
  });

  const updateAddressEncryptedPayloadStr = JSON.stringify({
    modifiedByApp: 'drx',
    customerIdentifier:
      '3450455dc21898b65eafafd2d21604c95b62958b50c087fc3aec9f78a628e51cuJ9pkkFmgecVOqqxgneCJQ%3D%3Dc4731276420a7619fd846f6d737a4d2e078a151b290faecfb1b7d1d83714fdc0',
    addressId: 'a0H7Y000005GBX4UAO',
    street1: '22 on the Grn',
    street2: '',
    street3: '',
    street4: null,
    city: 'Verbank',
    state: 'NY',
    postalCode: '12585-5115',
    countryIso2Code: 'US'
  });

  const updateAddressDecryptedPayloadStr = JSON.stringify({
    request: {
      modifiedByApp: 'drx',
      modifiedBy: 'Amanda Ward',
      address: {
        customerIdentifier: '162748173278165',
        addressId: 'a0H7Y000005GBX4UAO',
        street1: '22 on the Grn',
        street2: '',
        street3: '',
        street4: null,
        city: 'Verbank',
        state: 'NY',
        postalCode: '12585-5115',
        countryIso2Code: 'US',
        isCurrentResidence: true
      }
    }
  });
  beforeEach(() => {
    const config = JSON.parse(configStr);
    addressController = new AddressController(userFlow, config);
  });

  it('CASE: retrieveAddress returns addressess decorated with permissions', async () => {
    const context = {
      sub: '162748173278165',
      obj: '162748173278165',
      sub_userType: 'Recipient',
      countryCode: 'US'
    };

    sinon.stub(addressController, 'getFromCache').resolves(undefined);
    sinon
      .stub(addressController.addressService, 'retrieveAddress')
      .resolves(JSON.parse(decoratedAddressStr));
    sinon.stub(addressController, 'saveInCache').resolves(undefined);

    const resp = await addressController.retrieveAddress(context);

    expect(resp).to.deep.equal(JSON.parse(decoratedAddressStr));
  });

  it('CASE: retrieveAddress returns address decorated with permissions', async () => {
    const context = {
      sub: '162748173278165',
      obj: '162748173278165',
      sub_userType: 'Recipient',
      countryCode: 'US',
      addressId: '1'
    };

    sinon.stub(addressController, 'getFromCache').resolves(undefined);
    sinon
      .stub(addressController.addressService, 'readAddress')
      .resolves(JSON.parse(decoratedAddressStr));
    sinon.stub(addressController, 'saveInCache').resolves(undefined);

    const resp = await addressController.retrieveAddress(context);

    expect(resp).to.deep.equal(JSON.parse(decoratedAddressStr));
  });

  it('CASE: retrieveAddress calls saveInCache with "dev_drx-address_drx-dev-address-getAddress-_162748173278165-162748173278165",decoratedAddress,7200', async () => {
    const context = {
      sub: '162748173278165',
      obj: '162748173278165',
      sub_userType: 'Recipient',
      countryCode: 'US'
    };
    const addressCacheKey =
      'dev_drx-address_drx-dev-address-getAddress-_162748173278165-162748173278165';
    // sinon
    //   .stub(addressController.cacheKeyService, 'getKey')
    //   .returns(addressCacheKey);
    sinon.stub(addressController, 'getFromCache').resolves(undefined);
    sinon
      .stub(addressController.addressService, 'retrieveAddress')
      .resolves(JSON.parse(decoratedAddressStr));
    sinon.stub(addressController, 'saveInCache').resolves(undefined);

    await addressController.retrieveAddress(context);

    expect(
      addressController.saveInCache.calledWith(
        addressCacheKey,
        JSON.parse(decoratedAddressStr),
        7200
      )
    );
  });

  it('CASE: updateAddress returns status 200', async () => {
    const context = {modifiedBy: 'Amanda Ward', sub: '162748173278165'};

    sinon
      .stub(cryptography, 'decrypt')
      .returns(JSON.parse(updateAddressDecryptedPayloadStr));
    sinon
      .stub(addressController.addressService, 'updateAddress')
      .resolves({status: 200});
    sinon.stub(addressController, 'removeCacheEntry').resolves(undefined);

    const resp = await addressController.updateAddress(
      JSON.parse(updateAddressEncryptedPayloadStr),
      context
    );

    expect(resp).with.property('status').to.equal(200);
  });

  it('CASE: patchAddress returns status 200', async () => {
    const context = {modifiedBy: 'Amanda Ward', sub: '162748173278165'};

    sinon
      .stub(cryptography, 'decrypt')
      .returns(JSON.parse(updateAddressDecryptedPayloadStr));
    sinon
      .stub(addressController.addressService, 'patchAddress')
      .resolves({status: 200});
    sinon.stub(addressController, 'removeCacheEntry').resolves(undefined);

    const resp = await addressController.patchAddress(
      JSON.parse(updateAddressEncryptedPayloadStr),
      context
    );

    expect(resp).with.property('status').to.equal(200);
  });

  afterEach(() => {
    sinon.restore();
  });
});
