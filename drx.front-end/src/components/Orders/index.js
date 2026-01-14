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

// drx components
import OrderView from './OrderView/OrderView';

// utilities and helper functions
import { authenticationService } from '../../utils/_services';
import envConfig from '../../config';
import getTransformedOrders from './utils/getTransformedOrders';
import getTransformedOrderDetails from './utils/getTransformedOrderDetails';
import createLightList from './utils/createLightList';
import saveLightList from './utils/saveLightList';
import mapSingleColumns from './utils/mapSingleColumns';
import mapErrorConfig from './utils/mapErrorConfig';
import mapListTableConfig from './utils/mapListTableConfig';
import buildDetailsViewData from './utils/buildDetailsViewData';
import getCountryCochlearCom from '../../utils/getCountryCochlearCom';
import useUserList from '../../utils/useUserList';
import Spinner from '../Shared/Spinner/Spinner';

const { apiEndpoint } = envConfig;
const mockMode = process.env.REACT_APP_TEST_VAR === 'LOCAL';
const mockUrl =
  'https://d5bf7f38-2409-4725-8047-bf046bb23f08.mock.pstmn.io';
// 'http://127.0.0.1:4523/m1/3315209-0-default';

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

const Orders = props => {
  const {
    fields,
    token,
    tokenDetails,
    attributeDetails,
    labels,
    headerFooterDetails,
  } = props;
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
  const [isError, setIsError] = useState(false);

  /*
   * Update/Control user id, order number and error mode from query params in the route
   */

  // check if user is a carer and recipient
  const isCarerAndRecipient = personas =>
    personas.includes('recipient') && personas.includes('carer');

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

  const { isLoading: isTabsLoading, data: updatedUserList } =
    useUserList(
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
        mapListTableConfig(countryCode, locale, dataItem),
      );
    }
  }, [dataItem]);

  // array of order list table data
  const [listData, setListData] = useState([]);

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
        transformedOrderList,
        userId,
        lightListProp,
        SESSION_LIGHT_LIST_PREFIX,
      );

      setListData(transformedOrderList);
      setSessionLightList(lightList);
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

  const [orderTotals, setOrderTotals] = useState({});
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

      const transformedLines = orderLines
        ? getTransformedOrderDetails(orderLines, labels)
        : [];

      const orderTotals = {
        totalTax: response.data.totalTax,
        totalItemsAmount: response.data.totalItemsAmount,
        totalShipping: response.data.totalShipping,
        totalAmount: response.data.totalAmount,
      };

      setDetailList(transformedLines);
      setOrderTotals(orderTotals);
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
  const config = {
    mode: orderId ? 'details' : 'list',
    tabs: {
      accountId: sid,
      userId,
      labels: {
        promptText: labels['labels.tabs.promptText'],
        promptTextAbbrv: labels['labels.tabs.promptTextAbbrv'],
        type: labels['labels.tabs.tab2Type'],
      },
      tabs: userList,
    },
    list: {
      accountId: sid,
      userId,
      ...listTableConfig,
      handleSortDataChange,
      isFilteredFlag: !(listData.length > 0) ? '*' : undefined,
      noResultsLabel: 'labels.orders.message',
    },
    details: {
      accountId: sid,
      userId,
      ...singleTableConfig,
      handleSortDataChange: () => {},
      additionalInformation: dataItem.additionalInformation?.value,
    },
    errorView: errorConfig,
    isError,
    isLoading:
      isFetchingData || isFetchingDetailsData || isLoadingQuery,
    handleQueryParams,
    routerLink: Link,
    routerLocation: useLocation,
  };

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
        item[lightListProp].toString() === orderId
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
    sid,
    orderId,
    userId,
    location,
    activeUser,
    headerFooterDetails,
    orderTotals,
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
      toolbar: orderDetailsData.toolbar,
      headerItems: orderDetailsData.headerItems,
      totalData: orderDetailsData.totalData,
    },
  };

  return (
    <Router>
      <Route
        path={location.pathname}
        render={props => {
          return (
            <OrderView
              {...props}
              config={config}
              data={data}
              labels={labels}
            />
          );
        }}
      />
    </Router>
  );
};

export default withRouter(Orders);

Orders.propTypes = {
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

Orders.defaultProps = {};
