const sinon = require('sinon');
const {expect} = require('chai');
const connectors = require('../../../src/connector/index.js');
const {SFAddressService} = require('../../../src/service/index.js');
describe('SUITE: addressService', () => {
  const configStr = JSON.stringify({
    sfHostname: 'sf_hostname',
    sfClientId: 'sf_clientId',
    sfUserName: 'sf_userName',
    secret: 'secret',
    env: 'DEV',
    userSessionSeconds: 7200,
    userSessionPrefix: 'drx-dev-',
    cache: {get: function () {}, save: function () {}}
  });

  const sfRelationshipResponseStr = JSON.stringify(
    require('../../mock/sfRelationshipResponse.json')
  );
  const sfGetAddressResponseStr = JSON.stringify(
    require('../../mock/sfGetAddressResponse.json')
  );

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
  const tokenStr = JSON.stringify({
    hostname: '_hostname',
    clientSecret: '_secret.clientSecret',
    clientId: '_clientId',
    username: '_userName',
    password: '_secret.password',
    secretToken: '_secret.secret',
    instanceUrl: 'this.jsConnection.instanceUrl',
    accessToken: 'this.jsConnection.accessToken'
  });

  const decoratedAddressStr = JSON.stringify({
    addressId: 'a0H7Y000005GBX4UAO',
    customerIdentifier: '162748173278165',
    street1: '33 fdoe Ttu',
    street2: null,
    street3: null,
    street4: null,
    city: 'ddock',
    state: 'TX',
    postalCode: '79406-0016',
    countryIso2Code: 'US'
  });
  let addressService = undefined;
  beforeEach(() => {
    const config = JSON.parse(configStr);
    addressService = new SFAddressService(config);
  });

  it('CASE: retrieveAddress returns decoratedAddress.', async () => {
    sinon
      .stub(addressService.sfIntegrationToken, 'getCacheToken')
      .resolves(JSON.parse(tokenStr));
    sinon.stub(connectors, 'SFConnector').returns(
      new (class {
        constructor() {}
        async getRelationship() {
          return JSON.parse(sfRelationshipResponseStr);
        }
        async getAddress() {
          return JSON.parse(sfGetAddressResponseStr);
        }
      })()
    );

    const sub = '162748173278165';
    const obj = '162748173278165';
    const sub_userType = 'Recipient';
    const countryCode = 'US';
    const resp = await addressService.retrieveAddress(
      sub,
      sub_userType,
      countryCode,
      obj
    );
    console.log(JSON.stringify(resp));
    expect(resp).to.deep.equal(JSON.parse(decoratedAddressStr));
  });

  it('CASE: updateAddress returns status 200', async () => {
    sinon
      .stub(addressService.sfIntegrationToken, 'getCacheToken')
      .resolves(JSON.parse(tokenStr));
    sinon.stub(connectors, 'SFConnector').returns(
      new (class {
        constructor() {}
        async postAddress() {
          return {status: 200};
        }
      })()
    );

    const context = {modifiedBy: 'Amanda Ward'};
    const obj = '162748173278165';
    const updateAddressEncryptedPayloadJSON = JSON.parse(
      updateAddressEncryptedPayloadStr
    );
    const resp = await addressService.updateAddress(
      updateAddressEncryptedPayloadJSON,
      context,
      obj
    );

    expect(resp).with.property('status').to.equal(200);
  });

  afterEach(() => {
    sinon.restore();
  });
});
