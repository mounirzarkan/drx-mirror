'use strict';

const {decrypt} = require('../../src/util/encrypt.js');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const {expect} = require('chai');
const axios = require('axios');

const key = 'ae593e40bd61aa293ab8daf094666d40a900a2de2df87b383711e03463d75fd8';

const privateKey =
  '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEArORn60MX4VIzhgSy0cOXDOYB+UJa5wYxvgq6dzzQLEzPdJ+UMUpQ+k+1HsInFOoO7ym1TpM1PmRRoMC577DfsN7j4Epop+9jeO9eh0RAdEPLHwmz/XhOpM7sjnui/7XlL63e3L+7/DkER6/VHNvUIVZbLTLdjFxgS51T0w4eehPD+z6IlOuE7yNw+zW4ujr5VycPi3kQ7TGBq/MZ1vB1jnRLqZ49UdZqDvf+29iF9vAq1O32cV5pYkKpy1XBGaG3js42eDF1TZ16Eu/bfks8szx5dqyELpgIF0wvjR2oEgg6da+u0BmOJDUPzLvnk0GUA0895ifBHeBjrQC61q3cjQIDAQABAoIBAHfA1UIdfOLzHwELLBkjUvL6Ng/CqFgw8C9kGvgQRVkJ8wAisHDbuu9GWnvtm0hfPuzlhNHiIRUQQ4IHPEMLzkUifdCTeZ4osEvJ8T3cRpDBjGX5QJSmykJZmXyvop1gDllSI3Xf0IPJsm89GW4dzfcxa4IJI2/fZEu7s54Sv4VqG+uiepnZtzE+FE5Q8bTvWlYe3wm6f2FpoFcTUqxXLp6xK3mBYrkUjCWnk0SU8KZWfqYR4YBj/o8Sl2qur/uIlvtuRCKGYCzNnAz7AtOZzmwEHf8rU38cVlNUk/i62eRdVzqfJnX99/Taqsh+DfbCtVtfxJVFuloRS+6LIlNrvwECgYEA1nsKdPlWQCCr6dXh+ECVYRKMCLQsBvlW2GF04539P0VH62wm4sbLdTX/BJnpUxHQu1Or3XNcQtpm+QdQkfI1g/e7gKLj2sR7ixZODhc3NKPeGMCY5gqDguGaLVqMFfiQGAz9+PP7hddEPRbjQd9cBDGlBvMpO0XF5Rr5zdWNnKECgYEAzlxhBa0hpySWG57iqxF6pfx7DjEKGldrcLM+Qttbhr1kwkMlYF8r6CVvRErMayuNyLI9cRo4V0LnK3aIY6r6XAOXwpXYL2DYWCkQvnF2cNq82c6OUYgGRzMVtTMVNGXVJL5ySypEakyh9lKtJx0XprnqjOl7+GJAPsy6ddxmrG0CgYBLnkHHkAkKvvodjV0IK6z+9o0MnIlRRCOMUn/lqFQbNI/wvsbO+YvOHWV199W9hfBzu0JC52NF5r6bWirb6etYRcWDyupOvStZlFmcui6qjoPFclH1+Qr44BV9nAj7zhDvidUZKtwpCgZzC1jAZsGIcQBf/OcykJz+843TNlGhQQKBgQDDcOB+1MMbnt3/2NIKfKpxTBdrkGxmGEdsXIZqIYCksvkbtyZOCLT3z4R65HCIS56j5pOka9XSZ02zbzarVoJ45Po1U1+FN66OiI4QIDuxlKjpi+RkOXTgt/QmQfQiRRPCEhEDOUvEdUGrng/aDIaa5FfND1DXJI5+K72o5I3lXQKBgBl1RIqaLFS3cB0iKk8jjNcG99Xmi5a2PFbZPcOBEHZV6IPMa5Xws9NI44qUp+o0pvFQeQECh/jDn8gAExUtg0Zo6N8flwEDSi43SVskV8iJMiHGPS2HhWcpB+glz0FlNnpFina7KdLA94ZgIXjnFB9hCqw1gALatRuQ5ceDFKWV\n-----END RSA PRIVATE KEY-----';

const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArORn60MX4VIzhgSy0cOX\n' +
  'DOYB+UJa5wYxvgq6dzzQLEzPdJ+UMUpQ+k+1HsInFOoO7ym1TpM1PmRRoMC577Df\n' +
  'sN7j4Epop+9jeO9eh0RAdEPLHwmz/XhOpM7sjnui/7XlL63e3L+7/DkER6/VHNvU\n' +
  'IVZbLTLdjFxgS51T0w4eehPD+z6IlOuE7yNw+zW4ujr5VycPi3kQ7TGBq/MZ1vB1\n' +
  'jnRLqZ49UdZqDvf+29iF9vAq1O32cV5pYkKpy1XBGaG3js42eDF1TZ16Eu/bfks8\n' +
  'szx5dqyELpgIF0wvjR2oEgg6da+u0BmOJDUPzLvnk0GUA0895ifBHeBjrQC61q3c\n' +
  'jQIDAQAB\n' +
  '-----END PUBLIC KEY-----\n';

describe.skip('test jwt.js', () => {
  let myJwt;
  before(function () {
    process.env.userSessionSeconds = '200';
    myJwt = require('../../src/connector/jwt.js');
  });
  after(function () {
    process.env.userSessionSeconds = undefined;
  });
  beforeEach(function () {
    // sandbox.stub(myJwt, 'SESSION_LENGTH').value(200);
  });
  afterEach(function () {
    sandbox.restore();
  });
  const data = {foo: 'test'};
  const sub = 'cochlear-1';
  const firstName = 'Jacky';
  const lastName = 'chan';
  const sfToken = 'dummySF';
  const clames = {
    _firstName: firstName,
    _lastName: lastName,
    _countryCode: 'US',
    _languageCode: 'En',
    _userType: 'Recipient',
    _app: 'drx',
    _sfToken: sfToken,
    _cochlearId: sub
  };
  describe('test JWT renew logic: ', () => {
    // const {renewJWTSessionToken} = myJwt;
    const OLD_JWT = 'THIS VALUE';
    const NEW_JWT = 'THAT VALUE';
    const refresh_token = 'abcdefg123456788';

    const client = {
      client_id: '',
      client_secret: '',
      client_hostname: ''
    };

    const expiryFromEpoch = (minutes) =>
      Math.floor((Date.now() + minutes * 60 * 1000) / 1000);
    sinon.stub(axios, 'request').returns({data: {id_token: 'THAT VALUE'}});
    it('Should return input JWT if session outside of expiry timeframe', async () => {
      const timeUntilExpiry = expiryFromEpoch(20); // 20 mins till expiry is more than 15 minute session renew length
      const renewedJwt = await myJwt.renewJWTSessionToken(
        {idToken: OLD_JWT, refresh_token},
        timeUntilExpiry,
        client
      );
      expect(renewedJwt).to.equal(OLD_JWT);
    });
    it('Should fetch new JWT if session within expirying timeframe', async () => {
      const timeUntilExpiry = expiryFromEpoch(10); // 10 mins till expiry is less than 15 minute session renew length
      const renewedJwt = await myJwt.renewJWTSessionToken(
        {idToken: OLD_JWT, refresh_token},
        timeUntilExpiry,
        client
      );
      expect(renewedJwt).to.equal(NEW_JWT);
    });
  });
});
