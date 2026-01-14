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

import { ServiceRequestsView } from '@cochlear-design-system/projects.drx';

import Spinner from '../Shared/Spinner/Spinner';
import useUserList from '../../utils/useUserList';
import { getErrorStatus } from '../../utils/useErrorStatus';
import { useHistoryState } from '../../utils/useHistoryState';
import { useListRequest } from '../../utils/serviceRequests/useListRequest';
import { useDetailRequest } from '../../utils/serviceRequests/useDetailRequest';
import { getSingleViewContent } from '../../utils/serviceRequests/getSingleViewContent';

import { createConfig } from './createConfig';
import { transformListData } from '../../utils/serviceRequests/transformListData';
import { transformDetailData } from '../../utils/serviceRequests/transformDetailData';
import { actionDataQuery } from '../../utils/serviceRequests/actionDataQuery';
import LazyResults from '../../utils/serviceRequests/LazyResults';

const lazyResults = new LazyResults();

/*
What does the url for service requests look like?
--------------------------------------------------
/account/my-profile/service-requests (default)
/account/my-profile/service-requests?account=38cfdcf5-6888-471b-b2d9-eb358529fabd&user=0&page=0

// breakdown
?account=sid
&user=userlistIndex
&page=paginationNo
-----------

Remember:
All interactions should update the url params. 
Chanes/Updates to url params should then be used to update the UI

eg: 
clicking on a row should change the url to include a id={requestId}, this should then change the view to details mode
*/

const ServiceRequests = props => {
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
  const personas =
    attributeDetails && attributeDetails.personas
      ? attributeDetails.personas.map(i => i.toLowerCase())
      : [];

  const { lang } = routeParams;

  const { location, pushHistory, queryParams, replaceHistory } =
    useHistoryState();

  // check if user is a carer and recipient
  const isCarerAndRecipient = personas =>
    personas.includes('recipient') && personas.includes('carer');

  // url query params to default variables.
  const {
    account = sid, // accountId
    id, // requestId
    user = 0, // userId
    error, // errorStatus
    page: queriedPage = 0, // page
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
        page,
      });
    },
    [id, user, page],
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

  // fallback images, error modes info from graphQL
  const { fallbackImages } = dataItem;

  // transform list and data callbacks defined
  const transformListDataCB = transformListData.bind(
    undefined,
    labels,
    fallbackImages,
  );

  // -----------------------------------------------------------------
  // STEP: 1
  // This is where we get the content from SF for the details view
  // previously this was already in `dataItem`

  const [detailsContent, setDetailsContent] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getSingleViewContent(
        token,
        dataItem.countryCode.value,
        lang,
      );

      // call error screen on single view content if gql content data fails
      // promise returns an array where first item is defined as data or error
      if (res[0] === 'error') onRequestError(res[1]);
      else setDetailsContent(res[1]);
    })();
  }, []);

  // END STEP: 1
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // STEP: 2
  // transform the details data

  const transformDetailDataCB = transformDetailData.bind(
    undefined,
    fallbackImages,
    detailsContent,
    userList,
  );

  // END STEP: 2
  // -----------------------------------------------------------------

  // fetches data required for service request list, userId is null until tabs data loads
  const { isFetchingList, listData } = useListRequest(
    {
      user,
      id,
      page,
      error,
    },
    userReqConfig,
    onRequestError,
    transformListDataCB,
  );

  // -----------------------------------------------------------------
  // STEP: 3
  // Fetches the user/device data required for details view
  // passes the transformed content data
  // fetches data required for equipment detail, userId is null until tabs data loads
  const { isFetchingDetail, detailData, onDetailRetry } =
    useDetailRequest(
      user,
      id,
      userReqConfig,
      onRequestError,
      transformDetailDataCB,
    );

  // END STEP: 3
  // -----------------------------------------------------------------

  const onErrorRetryCB = action => {
    if (action === 'retry-single-device') {
      onDetailRetry();
    }
    pushHistory({
      id,
      user,
      page,
    });
    return false;
  };

  const mode = id ? 'details' : 'list';

  // if isError return false, else wait for data
  // const isLoading = !!error
  //   ? false
  //   : isFetchingList && isFetchingDetail;

  const isLoading = false;

  const handleDataQuery = (data, action, parameters = {}) => {
    const queryData = actionDataQuery(
      {
        account,
        id,
        user,
        error,
        page,
      },
      action,
      parameters,
    );
    pushHistory(queryData);
  };

  // create an ordered array of servicerequest numbers
  // this gets passed to the prev/next toolbar controls
  const [sortedList, setSortedList] = useState([]);
  const handleSortDataChange = param => {
    const newList = param?.map(({ requestId }) => requestId);
    setSortedList(newList);
  };

  // -----------------------------------------------------------------
  // STEP: 4
  // Add the details view content to the main config that will be passed to the service requests component

  /*
   * Config assembled
   */

  const hasData = page > 0 || listData?.length > 0;
  const config = createConfig(
    countryCode,
    locale,
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
    `#${user}#`,
    `#${user}-${id}#`,
    detailData,
    detailsContent,
    isFetchingList,
    hasData,
    Link,
    location,
    handleSortDataChange,
    sortedList,
  );

  // END STEP: 4
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // STEP: 5
  // Add the details view data to the main data that will be passed to the service requests component

  const data = {
    list: {
      table: listData || [], // populated with only current page data
    },
    details: detailData || {},
  };

  // END STEP: 5
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // STEP: 6
  // Update the stateData view

  const stateData = {
    listStateData: isFetchingList
      ? { renderState: 'loading' }
      : undefined,
    detailsStateData: isFetchingDetail
      ? { renderState: 'loading' }
      : { renderState: undefined },
  };

  // END STEP: 6
  // -----------------------------------------------------------------

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
      page: 0,
      // group,
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
    <ServiceRequestsView
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
          return <ServiceRequests {...props} {...p} />;
        }}
      />
    </Router>
  );
});

ServiceRequests.propTypes = {
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

ServiceRequests.defaultProps = {};
