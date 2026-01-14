import React from 'react';
import i18n from 'i18next';
import Helmet from 'react-helmet';
import { SitecoreContext } from '@sitecore-jss/sitecore-jss-react';

import { fetchRouteData } from './lib/sitecore/fetchRoutedata'; // adjust path as needed
import { dataFetcher } from './dataFetcher';
import getLocalStorageLabels from './utils/getLocalStorageLabels';
import componentFactory from './temp/componentFactory';
import config from './temp/config';
import Layout from './Layout';
import NotFound from './NotFound';
import Spinner from './components/Shared/Spinner/Spinner';

import resolveSite from './SiteResolver';
import getDataLayerReady from './utils/_helpers/data_layer_ready';

// Dynamic route handler for Sitecore items.
// Because JSS app routes are defined in Sitecore, traditional static React routing isn't enough -
// we need to be able to load dynamic route data from Sitecore after the client side route changes.
// So react-router delegates all route rendering to this handler, which attempts to get the right
// route data from Sitecore - and if none exists, renders the not found component.

let ssrInitialState = null;

export default class RouteHandler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notFound: true,
      routeData: ssrInitialState, // null when client-side rendering
      defaultLanguage: config.defaultLanguage,
    };

    // route data from react-router - if route was resolved, it's not a 404
    if (props.route !== null) {
      this.state.notFound = false;
    }

    // if we have an initial SSR state, and that state doesn't have a valid route data,
    // then this is a 404 route.
    if (
      ssrInitialState &&
      (!ssrInitialState.sitecore || !ssrInitialState.sitecore.route)
    ) {
      this.state.routeData = null;
      this.state.notFound = true;
    }

    // if we have an SSR state, and that state has language data, set the current language
    // (this makes the language of content follow the Sitecore context language cookie)
    // note that a route-based language (i.e. /de-DE) will override this default; this is for home.
    if (
      ssrInitialState &&
      ssrInitialState.context &&
      ssrInitialState.context.language
    ) {
      this.state.defaultLanguage = ssrInitialState.context.language;
    }

    // once we initialize the route handler, we've "used up" the SSR data,
    // if it existed, so we want to clear it now that it's in react state.
    // future route changes that might destroy/remount this component should ignore any SSR data.
    // EXCEPTION: Unless we are still SSR-ing. Because SSR can re-render the component twice
    // (once to find GraphQL queries that need to run, the second time to refresh the view with
    // GraphQL query results)
    // We test for SSR by checking for Node-specific process.env variable.
    if (typeof window !== 'undefined') {
      ssrInitialState = null;
    }

    this.componentIsMounted = false;
    this.languageIsChanging = false;

    // tell i18next to sync its current language with the route language
    this.updateLanguage();
  }

  componentDidMount() {
    // if no existing routeData is present (from SSR), get Layout Service fetching the route data
    if (!this.state.routeData) {
      if (this.state.notFound) {
        this.get404RouteData();
      } else {
        this.updateRouteData();
      }
    }
    this.componentIsMounted = true;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  triggerDataLayerReady() {
    const { params } = this.props.route.match;
    const { routeData } = this.state;

    if (
      routeData !== null &&
      routeData.sitecore &&
      routeData.sitecore.route &&
      routeData.sitecore.context
    ) {
      const { route, context } = routeData.sitecore;
      getDataLayerReady(params, route, context);
    } else {
      getDataLayerReady(params, null, null);
    }
  }

  /**
   * Loads route data from Sitecore Layout Service into state.routeData
   */
  updateRouteData() {
    let sitecoreRoutePath =
      this.props.route.match.params.sitecoreRoute || '/';
    if (!sitecoreRoutePath.startsWith('/')) {
      sitecoreRoutePath = `/${sitecoreRoutePath}`;
    }

    const language =
      this.props.route.match.params.lang ||
      this.state.defaultLanguage;

    // get the route data for the new route
    getRouteData(sitecoreRoutePath, language).then(routeData => {
      if (
        routeData !== null &&
        routeData.sitecore &&
        routeData.sitecore.route
      ) {
        // set the sitecore context data and push the new route
        this.setState({ routeData, notFound: false }, () =>
          this.triggerDataLayerReady(),
        );
      } else {
        // Revert to the sitecore 404 page
        this.get404RouteData();
        this.triggerDataLayerReady();
      }
    });
  }

  get404RouteData() {
    const siteObject = resolveSite(window.location.pathname);
    let language = siteObject.lang;
    if (language) {
      language = language.includes('-')
        ? language.split('-')[0]
        : language;

      // Check for Norwegian
      language =
        language === 'nn' || language === 'nb' ? 'no' : language;

      // Check for Swedish
      language = language === 'sv' ? 'se' : language;
    }
    const siteString = '/404';

    getRouteData(siteString).then(routeData => {
      if (
        routeData !== null &&
        routeData.sitecore &&
        routeData.sitecore.route
      ) {
        // set the sitecore context data and push the new route
        this.setState({ routeData, notFound: false });
      } else {
        this.setState({ routeData: null, notFound: true });
      }
    });
  }

  /**
   * Updates the current app language to match the route data.
   */
  updateLanguage() {
    const { lang } = this.props.route.match.params;
    const locale = resolveSite(
      this.props.route.location.pathname,
    )?.dictionary;

    const newLanguage = locale || lang || this.state.defaultLanguage;

    if (i18n.language !== newLanguage) {
      this.languageIsChanging = true;

      i18n.changeLanguage(newLanguage, () => {
        this.languageIsChanging = false;

        // if the component is not mounted, we don't care
        // (next time it mounts, it will render with the right language context)
        if (this.componentIsMounted) {
          // after we change the i18n language, we need to force-update React,
          // since otherwise React won't know that the dictionary has changed
          // because it is stored in i18next state not React state
          this.forceUpdate();
        }
      });
    }
  }

  componentDidUpdate(previousProps) {
    const existingRoute = previousProps.route.match.url;
    const newRoute = this.props.route.match.url;

    // don't change state (refetch route data) if the route has not changed
    if (existingRoute === newRoute) {
      this.triggerDataLayerReady();
      return;
    }

    this.updateLanguage();
    this.updateRouteData();
  }

  render() {
    const {
      route,
      token,
      tokenDetails,
      attributeDetails,
      accessToken,
    } = this.props;
    const { match } = route;
    const { params, url } = match;
    const { notFound, routeData } = this.state;

    const locale = resolveSite(
      this.props.route.location.pathname,
    )?.dictionary;
    let labels = getLocalStorageLabels(locale);
    const labelsCheckEmpty = Object.keys(labels).length === 0;

    if (labelsCheckEmpty)
      labels = i18n.store.data[locale]?.translation;

    if (!routeData || this.languageIsChanging) {
      // If we don't have route data yet, or if the language is changing,
      // we show a spinner to indicate loading.
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            width: '100%',
          }}
        >
          <Spinner />
        </div>
      );
    }

    if (notFound) {
      return (
        <>
          <Helmet>
            <title>{i18n.t('Page not found')}</title>
          </Helmet>
          {/* You can optionally wrap NotFound in SitecoreContext as well */}
          <SitecoreContext
            componentFactory={componentFactory}
            context={routeData?.sitecore || {}}
          >
            <NotFound
              context={routeData?.sitecore?.context}
              token={token}
              tokenDetails={tokenDetails}
              attributeDetails={attributeDetails}
              routeParams={params}
              url={url}
            />
          </SitecoreContext>
        </>
      );
    }

    return (
      <SitecoreContext
        componentFactory={componentFactory}
        context={{
          route: routeData.sitecore.route,
          itemId: routeData.sitecore.route.itemId,
          ...routeData.sitecore.context,
        }}
      >
        <Layout
          route={routeData.sitecore.route}
          token={token}
          tokenDetails={tokenDetails}
          attributeDetails={attributeDetails}
          accessToken={accessToken}
          routeParams={params}
          url={url}
          labels={labels}
        />
      </SitecoreContext>
    );
  }
}

/**
 * Sets the initial state provided by server-side rendering.
 * Setting this state will bypass initial route data fetch calls.
 * @param {object} ssrState
 */
export function setServerSideRenderingState(ssrState) {
  ssrInitialState = ssrState;
}

/**
 * Gets route data from Sitecore. This data is used to construct the component layout for a JSS route.
 * @param {string} route Route path to get data for (e.g. /about)
 * @param {string} language Language to get route data in (content language, e.g. 'en')
 */
function getRouteData(route, language) {
  // Get custom site object to resolve site context and language.
  const siteObject = resolveSite(window.location.pathname);

  const fetchOptions = {
    layoutServiceConfig: { host: config.sitecoreApiHost },
    querystringParams: {
      sc_lang: siteObject.lang,
      sc_site: siteObject.siteName,
      sc_apikey: config.sitecoreApiKey,
    },
    fetcher: dataFetcher,
  };

  return fetchRouteData(route, fetchOptions).catch(error => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data
    ) {
      return error.response.data;
    }

    // Log the error in development mode for debugging purposes
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Route data fetch error:', {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
    }

    return null;
  });
}
