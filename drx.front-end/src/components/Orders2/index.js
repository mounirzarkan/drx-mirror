/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  Link,
  useHistory,
  withRouter,
} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import { Text } from '@cochlear-design-system/foundation';
import { OrderView } from '@cochlear-design-system/projects.drx';
import { createConfig } from './createConfig';
import Spinner from '../Shared/Spinner/Spinner';

import getCountryCochlearCom from '../../utils/getCountryCochlearCom';
import useUserList from '../../utils/useUserList';
import { authenticationService } from '../../utils/_services';
import envConfig from '../../config';

import getTransformedOrders from './utils/getTransformedOrders';
import getTransformedOrderDetails, {
  getTransformedOrderStatus,
} from './utils/getTransformedOrderDetails';
import createLightList from './utils/createLightList';
import saveLightList from './utils/saveLightList';
import mapSingleColumns from './utils/mapSingleColumns';
import mapErrorConfig from './utils/mapErrorConfig';
import mapListTableConfig from './utils/mapListTableConfig';
import buildDetailsViewData from './utils/buildDetailsViewData';

const { apiEndpoint } = envConfig;
const mockMode = process.env.REACT_APP_TEST_VAR === 'LOCAL';
const mockUrl =
  'https://d5bf7f38-2409-4725-8047-bf046bb23f08.mock.pstmn.io';

const ordersAPI = !mockMode
  ? `${apiEndpoint}/patients/me/orders`
  : `${mockUrl}/patients/me/orders`;

const SESSION_LIGHT_LIST_PREFIX = 'lightList_';

// update cookie
function updateUserToken(token) {
  authenticationService.updateCurrentUser(token);
}

// fetch data
async function getData(url, currentUser) {
  const response = await axios(url, {
    params: {},
    headers: { Authorization: `Bearer ${currentUser}` },
  });
  if (!mockMode) {
    // from returned response
    const newToken =
      response.headers['x-amzn-remapped-authorization'];
    if (newToken) updateUserToken(newToken);
  }
  return response && response.data;
}

const Orders2 = props => {
  const { fields, token, tokenDetails, attributeDetails, labels } =
    props;
  const { locale, countryCode, userType, sub, sid } = tokenDetails;
  const personas =
    attributeDetails && attributeDetails.personas
      ? attributeDetails.personas.map(i => i.toLowerCase())
      : [];

  // react router
  const history = useHistory();
  const location = useLocation();

  // create state for loading and error profile
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isFetchingDetailsData, setIsFetchingDetailsData] =
    useState(false);
  const [isLoadingQuery, setLoadingQuery] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [retry, setRetry] = useState(-1);

  // user, order and error are used as query params
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [view, setView] = useState('');
  const [isError, setIsError] = useState(false);

  // check if user is a carer and recipient
  const isCarerAndRecipient = personas =>
    personas.includes('recipient') && personas.includes('carer');

  /*
   * Update/Control user id, order number and error mode from query params in the route
   */

  const handleQueryParams = useCallback(function queryParams(ids) {
    // if a param exists in the url without a value, it will return an empty string (eg: &user alone will return '')
    // if it doesnt exist at all, it returns as null, if it's url encoded it will return "null" as a string
    setLoadingQuery(true);
    const { user, order, error } = ids;

    // set the user id
    if (user !== 'null') {
      setUserId(user);
    } else {
      setUserId(0);
    }

    // set order id
    setOrderId(order !== 'null' ? order : '');

    // set view (list : default / details / status)
    setView(view !== 'null' ? view : '');

    // set the error mode
    if (error !== null) {
      setIsError(true);
      setErrorStatus(error);
    } else {
      setIsError(false);
    }
  }, []);

  const setErrorState = (historyPath, error) => {
    setIsError(true);
    const errStatus = error?.response
      ? error.response?.status
      : 'Network Error';
    setErrorStatus(errStatus);
    history.push(`${historyPath}&error=${errStatus}`);
  };
  /*
   * Configure logged in user and tabs
   */

  // Tab user list
  // In order view, a carer is not included in the tab layout
  const [userRequest] = useState({
    targetUserId: sub,
    currentUser: token,
  });

  const {
    isLoading: isTabsLoading,
    //   error: tabsError,
    data: updatedUserList,
  } = useUserList(
    userRequest,
    {
      includeCarer: isCarerAndRecipient(personas) ? true : false,
      userType,
      sub,
      countryCode,
    },
    labels,
    setErrorState.bind(
      this,
      `${location.pathname}?account=${sid}&user=${userId}`,
    ),
  );

  const [defaultUserList] = useState([
    {
      firstName: '',
      lastName: '',
      tabIndex: 0,
      type: userType,
      userId: sub,
    },
  ]);

  const userList =
    updatedUserList || (isError && defaultUserList) || null;

  useEffect(() => {
    const detailsContainer = document.getElementsByClassName(
      'detailsContainer',
    )[0];
    if (detailsContainer) {
      detailsContainer.style.display = 'none';
    }

    const statusContainer =
      document.getElementsByClassName('statusContainer')[0];
    if (statusContainer) {
      statusContainer.style.display = 'none';
    }

    const target = document.getElementsByClassName(
      `${view || 'details'}Container`,
    )[0];

    if (target) {
      target.style.display = 'block';
    }
  }, [
    view,
    orderId,
    isFetchingData,
    isFetchingDetailsData,
    isLoadingQuery,
  ]);

  const updatePath = path => {
    // used for the context menu prev/next which returns a full path
    const urlParams = new URLSearchParams(path);
    const orderNumber = urlParams.get('order');

    setOrderId(orderNumber);
    setView('details');
    history.push(path);
  };

  const handleNavigateToDetails = (data, action, parameters = {}) => {
    setOrderId(parameters?.data?.HeaderId);
    setView(parameters?.view || view);

    history.push(
      `${location.pathname}?account=${parameters?.accountId}&user=${
        parameters?.userId
      }&order=${parameters?.data?.HeaderId}&view=${
        parameters?.view || 'details'
      }`,
    );
  };

  const handleNavigateToList = (data, action, parameters = {}) => {
    setOrderId('');
    setView('');
    history.push(
      `${location.pathname}?account=${parameters.accountId}&user=${parameters.userId}`,
    );
  };

  // all the config data for tables and details
  const dataItem = fields.data?.item;

  /*
   * Fetch Order List table data
   */

  // column config for orders list table
  const [listTableConfig, setListTableConfig] = useState({});
  useEffect(() => {
    if (dataItem) {
      setListTableConfig(
        mapListTableConfig(
          countryCode,
          locale,
          dataItem,
          handleNavigateToDetails,
        ),
      );
    }
  }, [dataItem]);

  // array of order list table data
  const [listData, setListData] = useState([]);
  const [hasInsuranceOrders, setHasInsuranceOrders] = useState(false);

  const fullListFields = dataItem.fullList?.fields.reduce(
    (acc, val, index) => {
      const value = (val && val.name) || '';
      return index !== 0 ? `${acc},${value}` : `${value}`;
    },
    '',
  );

  // the key name value used to sort and match orders (eg, HeaderId)
  const lightListProp = dataItem.lightList?.fields[0].name;
  const [sessionLightList, setSessionLightList] = useState([]);
  const handleSortDataChange = useCallback(
    function updateLightList(data) {
      const light = createLightList(data, lightListProp);

      window.sessionStorage.setItem(
        SESSION_LIGHT_LIST_PREFIX + userId,
        JSON.stringify(light),
      );
      if (light.length > 0) {
        setSessionLightList(light);
      }
    },
    // eslint-disable-next-line
    [lightListProp, userId, sessionLightList],
  );

  const fetchListData = async () => {
    setIsFetchingData(true);
    // get the cochlear.com website corresponding to the user token
    const countryStr = getCountryCochlearCom(countryCode);
    // TODO (PETE): OrderType to come from SC config
    try {
      const response = await getData(
        `${ordersAPI}?search=${fullListFields}&id=${userList[userId].userId}`,
        token,
      );
      const orders =
        response && response.data && response.data.orderHeaders;

      const transformedOrderList = orders
        ? getTransformedOrders(orders, labels)
        : [];

      const lightList = saveLightList(
        false,
        transformedOrderList[0],
        userId,
        lightListProp,
        SESSION_LIGHT_LIST_PREFIX,
      );

      // order by orderType (in case they are returned from the api ungrouped)
      // then by orderedDate
      setListData(
        _.sortBy(transformedOrderList[0], [
          'orderType',
          'OrderedDate',
        ]),
      );

      setSessionLightList(lightList);
      setHasInsuranceOrders(transformedOrderList[1]);
      setIsFetchingData(false);
    } catch (error) {
      if (
        error.response &&
        [401, 403].indexOf(error.response.status) !== -1
      ) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authenticationService.renew(countryStr);
        return false;
      }

      setErrorState(
        `${location.pathname}?account=${sid}&user=${userId}`,
        error,
      );
      setIsFetchingData(false);
    }

    return null;
  };

  useEffect(() => {
    // call api when the user id has changes (eg, changed user tab)
    if (userId !== null) fetchListData();
  }, [userId]);

  /*
   * END Order List table data
   */

  /*
   * Fetch Order Details table data
   */

  // column config for orders details table
  const [singleTableConfig, setSingleTableConfig] = useState({});
  useEffect(() => {
    setSingleTableConfig(
      mapSingleColumns(dataItem, locale, countryCode),
    );
  }, [dataItem]);

  const [detailList, setDetailList] = useState([]);
  const detailListFields = dataItem.detailsList?.targetItems.reduce(
    (acc, val, index) => {
      const value = (val && val.name) || '';
      return index !== 0 ? `${acc},${value}` : `${value}`;
    },
    '',
  );

  const [isInsuranceOrder, setIsInsuranceOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState({});
  const fetchDetailsData = async () => {
    setIsFetchingDetailsData(true);

    // get the cochlear.com website corresponding to the user token
    const countryStr = getCountryCochlearCom(countryCode);
    // orderId
    try {
      const response = await getData(
        process.env.REACT_APP_TEST_VAR === 'LOCAL'
          ? mockUrl + '/patients/me/orders/61246290/lines'
          : `${ordersAPI}/${orderId}/lines?search=${detailListFields}&id=${userList[userId].userId}`,
        token,
      );
      const orderLines =
        response && response.data && response.data.orderLines;
      const orderStatus = response && response.data;

      const transformedLines = orderLines
        ? getTransformedOrderDetails(orderLines, labels)
        : [];

      const transformOrderStatus =
        orderLines && orderStatus.orderStatus // checks to see if orderStatus information exists inside of teh orderStatus obj
          ? getTransformedOrderStatus(
              orderStatus,
              dataItem.dateFormat.value,
            )
          : {};

      setDetailList(transformedLines);
      setOrderStatus(transformOrderStatus);
      // check order status exists and then what type
      // this is used to help deliver messaging specific to insurance orders
      setIsInsuranceOrder(
        transformOrderStatus?.type?.toUpperCase() ===
          'CAM-REIMBURSEMENT-ORD'
          ? true
          : false,
      );
      setIsFetchingDetailsData(false);
    } catch (error) {
      if (
        error.response &&
        [401, 403].indexOf(error.response.status) !== -1
      ) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authenticationService.renew(countryStr);
        return false;
      }

      setErrorState(
        `${location.pathname}?account=${sid}&user=${userId}&order=${orderId}`,
        error,
      );
      setIsFetchingDetailsData(false);
    }
    return null;
  };

  useEffect(() => {
    // call api when the user id has changes (eg, changed user tab)
    if (userId !== null && orderId) fetchDetailsData();
  }, [userId, orderId, retry]);

  /*
   * END Order Details table data
   */

  /*
   * Configure Order Error view
   * order error screen action button callbacks
   */

  function handleErrorCallback(action) {
    if (action === 'retry-single-order') {
      setIsError(false);
      setRetry(prevRetry => prevRetry + 1);
      history.push(
        `${location.pathname}?account=${sid}&user=${userId}&order=${orderId}`,
      );
    }
    return false;
  }

  const errorConfig = mapErrorConfig(
    props,
    orderId ? 'details' : 'list',
    errorStatus,
    handleErrorCallback,
    labels,
  );

  /*
   * Order config assembled
   */
  const isEmpty = !listData.length > 0; // no data
  let config = createConfig(
    props,
    countryCode,
    locale,
    orderId ? 'details' : 'list',
    labels,
    sid,
    userId,
    userList,
    isError,
    isFetchingData || isFetchingDetailsData || isLoadingQuery,
    dataItem,
    errorStatus,
    handleErrorCallback,
    handleQueryParams,
    handleSortDataChange,
    Link,
    useLocation,
    useHistory,
    handleNavigateToDetails,
    orderStatus,
    isEmpty,
  );

  useEffect(() => {
    if (isLoadingQuery) {
      setLoadingQuery(false);
    }
  }, [isLoadingQuery]);

  // takes a fraction of time
  // if (isLoadingProfile) return null;

  if (!userList || isTabsLoading) {
    // no userList (used to create tabs) and isLoading show spinner
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  let orderItem =
    orderId &&
    listData.find(item => {
      return (
        item &&
        lightListProp &&
        item[lightListProp] &&
        item[lightListProp].toString() === orderId.toString()
      );
    });

  const activeUser = userList[userId];

  const orderDetailsData = buildDetailsViewData(
    props,
    labels,
    locale,
    countryCode,
    orderItem,
    detailList,
    sessionLightList,
    orderStatus,
    view,
    sid,
    orderId,
    userId,
    location,
    activeUser,
    Link,
    handleNavigateToList,
    handleNavigateToDetails,
    updatePath,
  );

  /*
   * Order data assembled
   */

  const data = {
    list: {
      table: config.mode === 'list' ? listData : [],
    },
    details: {
      table: detailList,
      // edit this toolbar data to match mock
      toolbar: orderDetailsData.toolbar,
      headerItems: orderDetailsData.headerItems,
      totalData: orderDetailsData.totalData,
      orderStatus: orderDetailsData.orderStatus,
    },
  };

  return (
    <Router>
      <Route
        path={location.pathname}
        render={props => {
          return (
            <>
              <OrderView
                {...props}
                config={config}
                data={data}
                labels={labels}
              />
              {/* Orders view disclaimer text, only show if orders have insurance */}
              {(config.mode === 'list' && hasInsuranceOrders) ||
              (config.mode !== 'list' &&
                isInsuranceOrder &&
                view !== 'status') ? (
                <Text
                  content={
                    labels[dataItem.disclaimer.targetItem.key.value]
                  }
                  isHTML
                  style={{
                    marginTop: '2em',
                    marginRight: '1em',
                    marginLeft: '1em',
                  }}
                  className="insurance-disclaimer"
                />
              ) : (
                <div />
              )}
            </>
          );
        }}
      />
    </Router>
  );
};

export default withRouter(Orders2);

Orders2.propTypes = {
  token: PropTypes.string.isRequired,
  tokenDetails: PropTypes.shape({
    sid: PropTypes.string,
    locale: PropTypes.string,
    countryCode: PropTypes.string,
    userType: PropTypes.string,
    sub: PropTypes.string,
  }).isRequired,
  url: PropTypes.string.isRequired,
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

Orders2.defaultProps = {};
