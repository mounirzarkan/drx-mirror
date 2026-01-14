/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { createQueryStr } from './createQueryStr';

export const useHistoryState = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = Object.fromEntries(
    new URLSearchParams(location.search),
  );

  const pushHistory = useCallback(
    state => {
      const queryStr = createQueryStr(location.pathname, state);
      history.push(queryStr);
    },
    [history, location.pathname],
  );

  const replaceHistory = useCallback(
    state => {
      const queryStr = createQueryStr(location.pathname, state);
      history.replace(queryStr);
    },
    [history, location.pathname],
  );

  return {
    history,
    location,
    pushHistory,
    queryParams,
    replaceHistory,
  };
};
