/* eslint-disable react-hooks/exhaustive-deps */
// React,
import { useState, useEffect, useCallback } from 'react';

import useHttpRequest from '../useHttpRequest';
import { UseLinkData } from './useLinkData';
import { createQueryStr } from '../createQueryStr';
import config from '../../config';

const { apiEndpoint } = config;
const equipmentDetailUrl = `${apiEndpoint}/patients/me/devices/single`;

let prevDetailsUid;

export const useDetailRequest = (
  user,
  id,
  userRequest,
  setError,
  transformData,
  serviceRequest,
  lang,
) => {
  const [retry, setRetry] = useState(false);

  const {
    isLoading: isFetchingDetail,
    // , error
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
          url: createQueryStr(equipmentDetailUrl, {
            id: targetUserId,
            deviceId: id,
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

  const [linkData, setLinkData] = useState([]);
  const fetchLinkData = useCallback(async () => {
    setLinkData([]);

    // only show toolbar links for SP and implants
    const showToolbarLinks =
      detailData?.classDeviceType === 'Sound Processor' ||
      detailData?.classDeviceType === 'Implant';

    if (!isTransitioning && detailData && showToolbarLinks) {
      try {
        let res = await UseLinkData(
          detailData,
          serviceRequest,
          countryCode,
          lang,
        );
        setLinkData(res);
      } catch (err) {
        throw new Error('Unable to get equipment links');
      }
    }
  }, [isTransitioning, detailData]);

  useEffect(() => {
    fetchLinkData();
  }, [fetchLinkData]);

  return {
    isFetchingDetail: isTransitioning ? true : isFetchingDetail,
    detailData: isTransitioning ? {} : detailData,
    onDetailRetry,
    linkData: isTransitioning ? [] : linkData,
  };
};
