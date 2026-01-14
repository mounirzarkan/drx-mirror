// checks if params are already encoded before encoding them.
// There was a problem where 'Speech%20Processor' was being encoded again as 'Speech%2520Processor'

function getUrlEncoded(sURL) {
  if (decodeURIComponent(sURL) === sURL)
    return encodeURIComponent(sURL);
  return getUrlEncoded(decodeURIComponent(sURL));
}

export const createQueryStr = (path, queryParams) => {
  let queryStr = Object.keys(queryParams)
    // removes empty values
    .filter(
      k =>
        queryParams[k] !== 'null' &&
        queryParams[k] !== null &&
        queryParams[k] !== undefined,
    )
    // maps key=value
    .map(k => `${getUrlEncoded(k)}=${getUrlEncoded(queryParams[k])}`)
    .join('&');
  queryStr = queryStr !== '' ? `?${queryStr}` : queryStr;
  return `${path}${queryStr}`;
};
