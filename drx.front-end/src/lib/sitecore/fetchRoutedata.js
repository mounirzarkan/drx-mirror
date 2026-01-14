import { fetchData } from '@sitecore-jss/sitecore-jss';

/**
 * Fetch route data from Sitecore Layout Service (JSS 20.x compatible).
 */
export function fetchRouteData(route, fetchOptions) {
  const {
    layoutServiceConfig: { host },
    querystringParams,
    fetcher,
  } = fetchOptions;

  const { sc_apikey, sc_lang, sc_site } = querystringParams;

  const url = `${host}/sitecore/api/layout/render/jss?item=${route}&sc_lang=${sc_lang}&sc_site=${sc_site}&sc_apikey=${sc_apikey}`;

  return fetchData(url, fetcher).catch(error => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data
    ) {
      return error.response.data;
    }

    return null;
  });
}
