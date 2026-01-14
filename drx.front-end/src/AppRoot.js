import React from 'react';
import { SitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import { Route, Switch } from 'react-router-dom';

import jwtDecode from 'jwt-decode';
import TagManager from 'react-gtm-module';

import componentFactory from './temp/componentFactory';
import RouteHandler from './RouteHandler';
import ScrollToTop from './ScrollToTop';

import config from './config';
import { authenticationService } from './utils/_services';
import getLanguageCode from './utils/getLanguageCode';
import mockTokenPayload from './utils/_helpers/mock_token_payload.json';

// This is the main JSX entry point of the app invoked by the renderer (server or client rendering).
// By default the app's normal rendering is delegated to <RouteHandler> that handles the loading of JSS route data.

// support languages in the URL prefix
// e.g. /da-DK/path, or /en/path, or /path
export const routePatterns = [
  '/:country([a-z]{2})/:lang([a-z]{2})/account/:sitecoreRoute*',
  '/account/:sitecoreRoute*',
  '/:sitecoreRoute*',
];

const { apiEndpoint } = config;
const authUrl = `${apiEndpoint}/auth/authorize`;

const tagManagerGlobal = {
  gtmId: 'GTM-PVM6MWV',
};

const tagManagerCAM = {
  gtmId: 'GTM-P53C7MV',
};

if (typeof window !== 'undefined') {
  TagManager.initialize(tagManagerGlobal);
  TagManager.initialize(tagManagerCAM);
}

const mockMode = process.env.REACT_APP_TEST_VAR === 'LOCAL';

const PrivateRoute = props => {
  const { privateComponent, path, key, computedMatch, token } = props;

  // local development can work without a valid user token
  if (mockMode) {
    // authorised so return component
    return <Route key={key} path={path} render={privateComponent} />;
  }

  if (token) {
    // authorised so return component
    return <Route key={key} path={path} render={privateComponent} />;
  }

  // Not logged in so redirect to login page
  // set this location as the referrer url
  authenticationService.setReferrer(
    computedMatch.params.country,
    computedMatch.params.lang,
  );

  return (
    <Route
      path="/"
      component={() => {
        // window check - server will fail without it
        if (typeof window !== 'undefined') {
          window.location.href = `${authUrl}?app=dm`;
          return null;
        }
        return null;
      }}
    />
  );
};

// wrap the app with:
// ApolloProvider: provides an instance of Apollo GraphQL client to the app to make Connected GraphQL queries.
//    Not needed if not using connected GraphQL.
// SitecoreContext: provides component resolution and context services via withSitecoreContext
// Router: provides a basic routing setup that will resolve Sitecore item routes and allow for language URL prefixes.
class AppRoot extends React.Component {
  render() {
    const { path, Router, ssrState } = this.props;

    // get user token
    const token = !mockMode
      ? authenticationService.currentUserValue
      : mockTokenPayload.token;
    const accessToken = !mockMode
      ? authenticationService.currentAccessToken
      : '';
    const attributes = !mockMode
      ? authenticationService.currentUserAttributesValue
      : '';

    const routeRenderFunction = props => {
      // get token details and pass them as props
      const decoded = token && jwtDecode(token);
      const sid = !mockMode
        ? decoded && decoded.sid
        : mockTokenPayload.sid;
      const name = !mockMode
        ? decoded && decoded.name
        : mockTokenPayload.name;
      const firstName = !mockMode
        ? decoded && decoded.given_name
        : mockTokenPayload.firstName;
      const lastName = !mockMode
        ? decoded && decoded.family_name
        : mockTokenPayload.lastName;
      const locale = !mockMode
        ? decoded && decoded.locale
        : mockTokenPayload.locale;
      const countryCode = !mockMode
        ? decoded && decoded['https://www.cochlear.com/country_code']
        : mockTokenPayload['https://www.cochlear.com/country_code'];
      const userType = !mockMode
        ? decoded && decoded['https://www.cochlear.com/user_type']
        : mockTokenPayload['https://www.cochlear.com/user_type'];

      const recipientList = !mockMode
        ? decoded && decoded['https://www.cochlear.com/recipient']
        : mockTokenPayload['https://www.cochlear.com/recipient'];
      // const sub = decoded && decoded.sub;
      const sub = !mockMode
        ? decoded && decoded['https://www.cochlear.com/cochlear_id']
        : mockTokenPayload['https://www.cochlear.com/cochlear_id'];

      const tokenDetails = {
        sid,
        name,
        firstName,
        lastName,
        locale: getLanguageCode(locale),
        countryCode,
        userType,
        recipientList: recipientList ? JSON.parse(recipientList) : [],
        sub,
      };

      const attributeDetails = attributes
        ? JSON.parse(attributes)
        : {};

      return (
        <RouteHandler
          route={props}
          token={token}
          tokenDetails={tokenDetails}
          attributeDetails={attributeDetails}
          accessToken={accessToken}
          isSSR={!!ssrState}
        />
      );
    };

    return (
      <SitecoreContext
        componentFactory={componentFactory}
        layoutData={ssrState}
      >
        <Router location={path} context={{}}>
          <ScrollToTop>
            <Switch>
              {routePatterns.map(routePattern => (
                <PrivateRoute
                  key={routePattern}
                  path={routePattern}
                  privateComponent={routeRenderFunction}
                  token={token}
                />
              ))}
            </Switch>
          </ScrollToTop>
        </Router>
      </SitecoreContext>
    );
  }
}

export default AppRoot;
