// config file
const jssConfig = require('./temp/config.js');

const {
  googleMapsApiKey,
  storeLogout,
  storeLogoutToken,
  gqlUrlToken,
  cookieDomain,
  deviceSupport,
  cochlearDotCom,
  drxMain,
  cochlearMCR,
  authorizeUser,
  apiEndpoint,
  cimRecipientLogout,
  graphQLEndpointPath,
  sitecoreApiKey,
  sitecoreApiHost,
  siteNameTemplateRoute = '${siteName}',
  auth0Host,
  auth0ClientId,
  auth0CustomDomain,
  auth0LogoutRedirectUrl,
  auth0AlmClientId,
  globalStoreDisabled,
  almRoot,
} = jssConfig;

const config = {
  env: process.env.REACT_APP_DRX_ENV || 'SIT',
  googleMapsApiKey,
  storeLogout,
  storeLogoutToken,
  gqlUrlToken,
  cookieDomain,
  deviceSupport,
  cochlearDotCom,
  drxMain,
  cochlearMCR,
  authorizeUser,
  apiEndpoint,
  cimRecipientLogout,
  sitecoreApiHost,
  auth0Host,
  auth0ClientId,
  auth0AlmClientId,
  auth0CustomDomain,
  auth0LogoutRedirectUrl,
  globalStoreDisabled,
  almRoot,
  graphQLEndpoint: `${graphQLEndpointPath}?sc_apikey=${sitecoreApiKey}&sc_site=${siteNameTemplateRoute.replace(
    '${siteName}',
    'drx-us-en',
  )}`,
};

export default config;
