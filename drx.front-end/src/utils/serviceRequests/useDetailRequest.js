/* eslint-disable react-hooks/exhaustive-deps */
// React,
import { useState, useEffect, useCallback } from 'react';

import useHttpRequest from '../useHttpRequest';
import { createQueryStr } from '../createQueryStr';
import config from '../../config';

const { apiEndpoint } = config;
const serviceRequestDetailUrl = `${apiEndpoint}/patients/me/service-requests`;

let prevDetailsUid;

export const useDetailRequest = (
  user,
  id,
  userRequest,
  setError,
  transformData,
) => {
  const [retry, setRetry] = useState(false);

  const {
    isLoading: isFetchingDetail,
    data: detailData,
    send,
  } = useHttpRequest(
    // set initial loading to false if userRequest is null.
    false,
  );

  const { countryCode, userList, currentUser } = userRequest;
  const targetUserId = userList && userList[user]?.userId;

  const detailsUid = `#${user}-${id}-${retry}#`;
  useEffect(() => {
    const control = { abort: false };

    if (detailsUid === prevDetailsUid) {
      return () => {};
    }

    if (id && targetUserId) {
      send(
        {
          ignoreLoading: false,
          renewAuthCountryCode: countryCode,
          remapAuthorization: true,
          url: createQueryStr(`${serviceRequestDetailUrl}/${id}`, {
            id: targetUserId,
          }),
          headers: {
            Authorization: `Bearer ${currentUser}`,
          },
          method: 'GET',
        },
        transformData,
        setError,
      );
      prevDetailsUid = detailsUid;
    }
    return () => {
      control.abort = true;
    };
  }, [targetUserId, id, retry]);

  const onDetailRetry = useCallback(() => {
    setRetry(!retry);
  }, [setRetry]);

  const isTransitioning = detailsUid !== prevDetailsUid;

  return {
    isFetchingDetail: isTransitioning ? true : isFetchingDetail,
    detailData: isTransitioning ? {} : detailData,
    onDetailRetry,
  };
};
