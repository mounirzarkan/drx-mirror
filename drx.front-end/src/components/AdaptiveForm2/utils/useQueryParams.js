/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* 
    handleQueryParams - function - pass query params from url as an object to callback.
    config - object - {queryName:{encoded:true | false}}
        for example:
            {
                user: { encoded: true },
            }
        In this case we are looking for a query param with the name "user" and we want it encoded.
*/
const useQueryParams = (handleQueryParams, config) => {
  const query = useQuery();

  // get names used to extract values from url query.
  const queries = Object.getOwnPropertyNames(config).sort();

  // gets url query params:
  //    creates an object with query param key/value.
  //    creates an array of query values for useEffect.
  const { queryObj, queryValues } = queries.reduce(
    (acc, name) => {
      const queryValue = query.get(name);
      const value = config[name]?.encoded
        ? encodeURIComponent(queryValue)
        : queryValue;
      acc.queryObj[name] = value;
      acc.queryValues.push(value);
      return acc;
    },
    { queryObj: {}, queryValues: [] },
  );

  // pass query params back to callback function
  useEffect(() => {
    // callback function
    handleQueryParams(queryObj);
  }, [handleQueryParams, ...queryValues]);
};
export default useQueryParams;
