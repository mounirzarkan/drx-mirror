import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../../config';
import getMinutes from '../getMinutes';

const {
  apiEndpoint,
  cookieDomain,
  cochlearDotCom,
  auth0CustomDomain,
  auth0ClientId,
  auth0LogoutRedirectUrl,
  auth0AlmClientId
} = config;

const authUrl = `${apiEndpoint}/auth/authorize`;
const revokeUrl = `${apiEndpoint}/auth/revoke`;

const cookieSettings = {
  domain: cookieDomain,
  secure: true,
};

function redirectToLogout() {
  console.log('Redirecting to Auth0 logout...');
  console.log('auth0CustomDomain', auth0CustomDomain);
  console.log('auth0ClientId', auth0ClientId);
  console.log('auth0LogoutRedirectUrl', auth0LogoutRedirectUrl);
  console.log('auth0AlmClientId', auth0AlmClientId);
  
  const auth0LogoutUrl = `${auth0CustomDomain}/v2/logout?client_id=${auth0ClientId}&returnTo=${auth0LogoutRedirectUrl}`;
  const almLogoutUrl = `${auth0CustomDomain}/v2/logout?client_id=${auth0AlmClientId}&returnTo=${auth0LogoutUrl}`;

  window.location.replace(almLogoutUrl);
}

function clearCookies() {
  Cookies.remove('currentUser', { domain: cookieDomain });
  Cookies.remove('accessToken', { domain: cookieDomain });


}

function logout(token) {
  
  if (token) {
    axios
      .post(revokeUrl, { token })
      .catch(() => {
        // TODO: Handle error if needed
      })
      .finally(() => {
        clearCookies();
        redirectToLogout();
      });
  } else {
    redirectToLogout();
  }
}

function setReferrer(country) {
  const referrerUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${cochlearDotCom}/${country}`;

  Cookies.set('referrerUrl', referrerUrl, {
    ...cookieSettings,
    path: '/',
    expires: getMinutes(15),
  });
}

function renew(country) {
  clearCookies();
  setReferrer(country);
  window.location.replace(`${authUrl}?app=dm`);
}

function updateCurrentUser(user) {
  Cookies.set('currentUser', user, {
    ...cookieSettings,
    expires: getMinutes(120),
  });
}

function getCurrentUser() {
  return Cookies.get('currentUser');
}

function getCurrentUserAttributes() {
  return Cookies.get('currentUserAttributes');
}

function getCurrentAccessToken() {
  return Cookies.get('accessToken');
}

export const authenticationService = {
  logout,
  renew,
  setReferrer,
  updateCurrentUser,
  get currentUserValue() {
    return getCurrentUser();
  },
  get currentUserAttributesValue() {
    return getCurrentUserAttributes();
  },
  get currentAccessToken() {
    return getCurrentAccessToken();
  },
};
