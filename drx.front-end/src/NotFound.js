import React from 'react';

import UniversalHeader from './components/UniversalHeader/UniversalHeader';

import './styles/main.scss';

// const cochlearBaseURL = config.CochlearDotCom[environment];

// Renders a route-not-found message when no route is available from Sitecore
// The JSS equivalent of a 404 Not Found page.

// This is invoked from RouteHandler when Sitecore returns no valid route data.
// The NotFound component receives the Layout Service Context data, but no route data.
// This can be used to power parts of your site, such as navigation, from LS context additions
// without losing the ability to render them on your 404 pages :)

const Navigation = ({
  token,
  tokenDetails,
  attributeDetails,
  routeParams,
  url,
}) => (
  <UniversalHeader
    token={token}
    tokenDetails={tokenDetails}
    attributeDetails={attributeDetails}
    routeParams={routeParams}
    url={url}
  />
);

const NotFound = ({
  context = { site: { name: '' }, language: '' },
  token,
  tokenDetails,
  attributeDetails,
  routeParams,
  url,
}) => {
  // get the cochlear.com website corresponding to the user token
  // const country = getCountryCochlearCom(tokenDetails.countryCode);
  return (
    <>
      <a
        id="skiplink"
        className="is-sr-only-focusable"
        href="#skipToContent"
      >
        <div className="container">
          <span className="skiplink-text">Skip to main content</span>
        </div>
      </a>
      <Navigation
        token={token}
        tokenDetails={tokenDetails}
        attributeDetails={attributeDetails}
        routeParams={routeParams}
        url={url}
      />

      {/* root placeholder for the app, which we add components to using route data */}
      <main className="site__content">
        <div id="skipToContent" tabIndex="-1" />
        <div className="content__wrapper">
          <div className="content__centered--default content__not-found">
            <h1>Page not found</h1>
            <p>This page does not exist.</p>
            <p>
              Site: {context.site && context.site.name}
              <br />
              Language: {context.language}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
