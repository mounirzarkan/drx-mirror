'use strict';

const {expect} = require('chai');
const proxyquire = require('proxyquire');

const AUTH0HOST = 'https://cochlear-poc.au.auth0.com';
const AUTH0AUTHORIZEPATH = '/authorize';
const AUTH0CLIENTID = 'genWNPWs3VwRNhIUX43v8rw9SW93qFrq';
const AUTH0AUDIENCE = 'https://cochlear.com/drx';
const CALLBACK_URL = 'https://authnz-dev.cx.nonp.cochlear.cloud/authorize';
const AUTH0_PROFESSIONAL_APPS = 'prof-store';
const CONNECTION_NAME_RECIPIENT = 'sf-db-patient';
const CONNECTION_NAME_PROF = 'sf-db-professional';

const params = {
  auth0Host: AUTH0HOST,
  auth0AuthorizePath: AUTH0AUTHORIZEPATH,
  auth0Audience: AUTH0AUDIENCE,
  auth0ClientId: AUTH0CLIENTID,
  auth0RedirectUri: CALLBACK_URL,
  auth0ProfessionalApps: AUTH0_PROFESSIONAL_APPS,
  auth0RecipientConnectionName: CONNECTION_NAME_RECIPIENT,
  auth0ProfessionalConnectionName: CONNECTION_NAME_PROF
};

const checkLoginUrl = (params, recipient = true) => {
  const scope = 'openid profile email offline_access';
  const app = params.app || 'dcx';
  const state = Buffer.from(JSON.stringify({app})).toString('base64');

  const checkLoginUrl =
    `${AUTH0HOST}` +
    `${AUTH0AUTHORIZEPATH}` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(AUTH0CLIENTID)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
    `&audience=${encodeURIComponent(AUTH0AUDIENCE)}` +
    `&state=${encodeURIComponent(state)}` +
    `&connection=${
      recipient ? CONNECTION_NAME_RECIPIENT : CONNECTION_NAME_PROF
    }` +
    `&app=${app}`; // drx specific params

  // stub out the random string generation
  const generateRandomString = () => 'ABCDE12345';
  const loginController = proxyquire('../../src/controller/loginController', {
    '../util/utils.js': {
      generateRandomString
    }
  });

  const loginUrl = loginController.getAuth0LoginURL(params);
  expect(loginUrl).not.null;
  expect(loginUrl).equal(checkLoginUrl);
};

describe('loginController', () => {
  describe('#getAuth0LoginURL', () => {
    it('auth0, default', () => {
      params.app = 'default';
      checkLoginUrl(params, true);
    });
    it('auth0, dm', () => {
      params.app = 'dm';
      checkLoginUrl(params, true);
    });
    it('auth0, ds', () => {
      params.app = 'ds';
      checkLoginUrl(params, true);
    });
    it('auth0, store', () => {
      params.app = 'store';
      checkLoginUrl(params, false);
    });
    it('auth0, prof-store', () => {
      params.app = 'prof-store';
      checkLoginUrl(params, false);
    });
  });
});
