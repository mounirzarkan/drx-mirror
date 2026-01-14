import {
  // React,
  useState,
  useCallback,
} from 'react';

export const getErrorStatus = error => {
  if (error) {
    return error?.response ? error.response?.status : 'Network Error';
  }
  return undefined;
};

// useErrorStatus (false,null,onError.bind(undefined,{action:'error'}))
export const useErrorStatus = (
  initError = false,
  initErrorStatus = null,
) => {
  const [isError, setIsError] = useState(initError);
  const [errorStatus, setErrorStatus] = useState(initErrorStatus);

  const setErrorState = useCallback(
    error => {
      const status = getErrorStatus(error);
      setIsError(!!status);
      setErrorStatus(status);
    },
    [setIsError, setErrorStatus],
  );

  return { isError, errorStatus, setErrorState };
};
