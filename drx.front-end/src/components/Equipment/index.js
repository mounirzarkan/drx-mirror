/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Route,
  useLocation,
  useHistory,
  Link,
  withRouter,
} from 'react-router-dom';

import { EquipmentView } from '@cochlear-design-system/projects.drx';
import Spinner from '../Shared/Spinner/Spinner';
import useUserList from '../../utils/useUserList';
import { getErrorStatus } from '../../utils/useErrorStatus';
import { useHistoryState } from '../../utils/useHistoryState';
import { useListRequest } from '../../utils/equipment/useListRequest';
import { useDetailRequest } from '../../utils/equipment/useDetailRequest';
import { fetchDevicesDetails } from '../../utils/equipment/fetchDevicesDetails';

import { createConfig } from './createConfig';
import { transformListData } from '../../utils/equipment/transformListData';
import { transformDetailData } from '../../utils/equipment/transformDetailData';
import { warrantyDataConfig } from '../../utils/equipment/warrantyDataConfig';
import { actionDataQuery } from '../../utils/equipment/actionDataQuery';
import { getActiveFilter } from '../../utils/equipment/getActiveFilter';
import LazyResults from '../../utils/equipment/LazyResults';
import config from '../../config';
const { gqlUrlToken, graphQLEndpoint, sitecoreApiHost } = config;

const DEVICES_URL = `${sitecoreApiHost}${graphQLEndpoint}`;
const AUTH_TOKEN = gqlUrlToken;

const lazyResults = new LazyResults();

const Equipment = props => {
  const {
    fields,
    token,
    tokenDetails,
    attributeDetails,
    routeParams,
    labels,
  } = props;
  const dataItem = fields?.data?.item;
  const { locale, countryCode, userType, sub, sid } = tokenDetails;
  const { lang } = routeParams;

  const personas =
    attributeDetails && attributeDetails.personas
      ? attributeDetails.personas.map(i => i.toLowerCase())
      : [];

  const { location, pushHistory, queryParams, replaceHistory } =
    useHistoryState();

  // check if user is a carer and recipient
  const isCarerAndRecipient = personas =>
    personas.includes('recipient') && personas.includes('carer');

  // check if user is a recipient
  const isRecipient = personas => personas.includes('recipient');

  // url query params to default variables.
  const {
    account = sid, // accountId
    id, // deviceId
    user = 0, // userId
    error, // errorStatus
    // sorting
    sort = 'purchaseDate', // sortBy
    order = 'desc', // orderBy
    // filtering
    filter, // filterBy
    filterValue, // filterValue
    page: queriedPage = 0, // page
    group = 0,
  } = queryParams;

  const page = lazyResults.next(queriedPage);

  // target info for tabs data request
  const [userListRequest] = useState({
    targetUserId: sub,
    currentUser: token,
  });

  // callback used for request errors
  const onRequestError = useCallback(
    err => {
      const errStatus = getErrorStatus(err);

      // push errStatus to history.
      pushHistory({
        id,
        user,
        error: errStatus,
        sort,
        order,
        filter,
        filterValue,
        page,
        group,
      });
    },
    [id, user, sort, order, filter, filterValue, page],
  );

  // fetches data required for tabs
  const { isLoading: isTabsLoading, data: updatedUserList } =
    useUserList(
      userListRequest,
      {
        includeCarer: isCarerAndRecipient(personas) ? true : false,
        userType,
        sub,
        countryCode,
      },
      labels,
      onRequestError,
    );

  // default user list in case of network error.
  const [defaultUserList] = useState([
    {
      firstName: '',
      lastName: '',
      tabIndex: 0,
      type: userType,
      userId: null,
    },
  ]);
  const userList =
    updatedUserList || (!!error && defaultUserList) || null;

  const userReqConfig = {
    sub,
    countryCode,
    userList,
    currentUser: token,
  };

  // fallback and warranty info from graphQL
  const { fallbackImage, serviceRequest, detailsSections } = dataItem;
  const warrantyListData = warrantyDataConfig(dataItem, 'list');
  const warrantyDetailData = warrantyDataConfig(dataItem, 'detail');

  const [productMeta, setProductMeta] = useState(null);

  // call the function
  const loadData = useCallback(async isSubscribed => {
    try {
      const result = await fetchDevicesDetails(
        DEVICES_URL,
        AUTH_TOKEN,
      );
      // set state with the result if `isSubscribed` is true
      if (isSubscribed) {
        setProductMeta(result);
      }
    } catch (err) {
      console.log('🚀 ~ loadData ~ err:', err);
    }
  }, []);

  useEffect(() => {
    // variable which controls wether to update the state
    let isSubscribed = true;

    loadData(isSubscribed);

    // cancel any future `loadData`
    return () => (isSubscribed = false);
  }, [loadData]);

  // transform list and data callbacks defined
  const transformListDataCB = transformListData.bind(
    undefined,
    warrantyListData,
    fallbackImage,
    productMeta,
  );

  // only shown if user persona is patient and when we are on the their tab.
  // eg; a patient/carer viewing one of their patients we dont want to show a raise sr button
  const isPatientPersona = isRecipient(personas) && user === '0';

  const transformDetailDataCB = transformDetailData.bind(
    undefined,
    warrantyDetailData,
    fallbackImage,
    serviceRequest,
    detailsSections[0].children,
    isPatientPersona,
    productMeta,
  );

  // fetches data required for equipment list, userId is null until tabs data loads
  const { isFetchingList, listData } = useListRequest(
    {
      user,
      id,
      sort,
      order,
      filter,
      filterValue,
      page,
      error,
    },
    userReqConfig,
    onRequestError,
    transformListDataCB,
  );

  // fetches data required for equipment detail, userId is null until tabs data loads
  const { isFetchingDetail, detailData, linkData, onDetailRetry } =
    useDetailRequest(
      user,
      id,
      userReqConfig,
      onRequestError,
      transformDetailDataCB,
      serviceRequest,
      lang,
    );

  const onErrorRetryCB = action => {
    if (action === 'retry-single-device') {
      onDetailRetry();
    }
    pushHistory({
      id,
      user,
      sort,
      order,
      filter,
      filterValue,
      page,
      group,
    });
    return false;
  };
  const mode = id ? 'details' : 'list';
  const isLoading = false; // isFetchingList || isFetchingDetail;

  const handleDataQuery = (data, action, parameters = {}) => {
    const queryData = actionDataQuery(
      {
        account,
        id,
        user,
        error,
        // sorting
        sort,
        order,
        // filtering
        filter,
        filterValue,
        page,
        group,
      },
      action,
      parameters,
    );
    pushHistory(queryData);
  };

  const hasData = page > 0 || listData?.length > 0;
  const activeFilter = getActiveFilter(filterValue);
  const config = createConfig(
    countryCode,
    locale,
    sort,
    order,
    mode,
    labels,
    sid,
    user,
    userList,
    !!error,
    isLoading,
    dataItem,
    error,
    onErrorRetryCB,
    handleDataQuery,
    activeFilter,
    `#${user}-${filterValue}-${sort}-${order}-${filter}#`,
    `#${user}-${id}#`,
    detailData,
    linkData,
    group,
    isFetchingList,
    hasData,
    productMeta,
  );

  const data = {
    list: {
      table: listData || [], // populated with only current page data
    },
    details: detailData || {},
  };

  const stateData = {
    listStateData: isFetchingList
      ? { renderState: 'loading' }
      : undefined,
    detailsStateData: isFetchingDetail
      ? { renderState: 'loading' }
      : { renderState: undefined },
  };

  config.router = {
    useLocation,
    useHistory,
    location,
    pushHistory,
    Link,
  };

  if (!id && !lazyResults.hasInitialResult()) {
    // set initial loading of results to 0;
    lazyResults.setLoadingInitialResult();

    // redirect user to start loading from 0-20 results
    replaceHistory({
      account,
      id,
      user,
      error,
      // sorting
      sort,
      order,
      // filtering
      filter,
      filterValue,
      page: 0,
      group,
    });
    return null;
  }

  if (!userList || isTabsLoading) {
    // no userList (used to create tabs) and isLoading show spinner
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <EquipmentView
      config={config}
      data={data}
      labels={labels}
      stateData={stateData}
    />
  );
};

export default withRouter(props => {
  return (
    <Router>
      <Route
        path="*"
        render={p => {
          return <Equipment {...props} {...p} />;
        }}
      />
    </Router>
  );
});

Equipment.propTypes = {
  token: PropTypes.string.isRequired,
  routeParams: PropTypes.shape({
    lang: PropTypes.string,
  }).isRequired,
  tokenDetails: PropTypes.shape({
    sid: PropTypes.string,
    locale: PropTypes.string,
    countryCode: PropTypes.string,
    userType: PropTypes.string,
    sub: PropTypes.string,
  }).isRequired,
  fields: PropTypes.shape({
    data: PropTypes.shape({
      item: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
    }),
  }).isRequired,
};

Equipment.defaultProps = {};
