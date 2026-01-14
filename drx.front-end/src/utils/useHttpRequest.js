/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useCallback } from 'react';
import axios from 'axios';
import { authenticationService } from './_services';
import getCountryCochlearCom from './getCountryCochlearCom';

function renewAuth(countryCode, statusCode) {
  if (countryCode) {
    const country = getCountryCochlearCom(countryCode);
    if ([401, 403].indexOf(statusCode) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.renew(country);
      return true;
    }
  }
  return false;
}

function reMapAuth(response) {
  // set new token
  const newToken =
    response?.headers &&
    response?.headers['x-amzn-remapped-authorization'];
  if (newToken) authenticationService.updateCurrentUser(newToken);
}
// reusable http request hook - handles common use cases such as sending a request and updating loading, error and data states.
// returns a state information and a callback that can be used to send a request.
export default function useHttpRequest(initLoading = true) {
  const [isLoading, setLoading] = useState(initLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const send = useCallback(
    async (
      // properties to be used in the axios request
      // {remapAuthorization,renewAuthCountryCode,...requestOptions}
      // remapAuthorization - when set to true updates current user token with returned newToken
      // renewAuthCountryCode - country code to renew users auth.
      // ...requestOptions - any other axios request options ie {url:'http...}.
      requestConfig,
      // callback to parse and transform response data
      transformData = null,
      // callback to parse and transform error data
      transformError = null,
      // about update of state
      control = { abort: false },
    ) => {
      const {
        remapAuthorization,
        ignoreLoading = false,
        ...requestOptions
      } = requestConfig;

      try {
        // throw { response: { status: '500' } };

        if (!ignoreLoading) setLoading(true);

        const response = await axios(requestOptions);

        if (!control.abort) {
          if (remapAuthorization) {
            reMapAuth(remapAuthorization, response);
          }

          // uses callback to transform data
          const transformedData = transformData
            ? transformData(response)
            : response;
          // updates data with transformedData
          setData(transformedData);
        }
      } catch (err) {
        if (!control.abort) {
          // check if need to renew auth.
          if (
            !renewAuth(
              requestConfig?.renewAuthCountryCode,
              err?.response?.status,
            )
          ) {
            // uses callback to transform error
            const result = transformError ? transformError(err) : err;
            // updates error with transformError
            setError(result);
          }
        }
      }
      if (!ignoreLoading && !control.abort) setLoading(false);
    },
    [setLoading, setError, setData],
  );

  return { isLoading, error, data, send, setData };
}
