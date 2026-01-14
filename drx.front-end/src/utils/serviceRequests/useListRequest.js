/* eslint-disable react-hooks/exhaustive-deps */
// React,
import { useState, useEffect, useCallback } from 'react';
import useHttpRequest from '../useHttpRequest';
import { createQueryStr } from '../createQueryStr';
import config from '../../config';

const { apiEndpoint } = config;

const serviceRequestListUrl = `${apiEndpoint}/patients/me/service-requests`;

let prevListUid;
export const useListRequest = (
  queryParams,
  userRequest,
  setError,
  transformData,
) => {
  const [retry, setRetry] = useState(false);

  const { user, page, error } = queryParams;

  const {
    isLoading: isFetchingList,
    data: listData,
    send,
  } = useHttpRequest(false);
  const { countryCode, userList, currentUser } = userRequest;
  const targetUserId = userList && userList[user]?.userId;
  const listUid = `#${user}-${retry}-${page}#`;
  useEffect(() => {
    const control = { abort: false };
    if (listUid === prevListUid) {
      return () => {};
    }
    if (!error && targetUserId && page >= 0) {
      send(
        {
          ignoreLoading: page !== 0,
          renewAuthCountryCode: countryCode,
          remapAuthorization: true,
          url: createQueryStr(serviceRequestListUrl, {
            id: targetUserId,
          }),
          headers: {
            Authorization: `Bearer ${currentUser}`,
          },
          method: 'GET',
        },
        transformData,
        setError,
        control,
      );
      prevListUid = listUid;
    }
    return () => {
      control.abort = true;
    };
    // don't watch for countryCode & currentUser
  }, [targetUserId, retry, page]);

  const onListRetry = useCallback(() => {
    setRetry(!retry);
  }, [retry, setRetry]);

  // handles transitional screen loading, prevents a flash of prev results
  const isTransitioning = listUid !== prevListUid && page === 0;
  return {
    isFetchingList: isTransitioning ? true : isFetchingList,
    listData: isTransitioning ? [] : listData,
    onListRetry,
  };
};
