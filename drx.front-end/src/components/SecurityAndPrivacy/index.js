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

import SecuritAndPrivacyView from './SecurityAndPrivacyView';

import Spinner from './../Shared/Spinner/Spinner';
import envConfig from '../../config';
import { authenticationService } from '../../utils/_services';
import mapErrorConfig from '../../utils/securityAndPrivacy/mapErrorConfig';
import getCountryCochlearCom from '../../utils/getCountryCochlearCom';
import useUserList from '../../utils/useUserList';
import { mapContentData } from '../../utils/securityAndPrivacy/mapContentData';

const { apiEndpoint } = envConfig;

const identityAPI = `${apiEndpoint}/patients/me/identity`;
const updateLoginAPI = `${apiEndpoint}/utils/update-login`;

// update cookie
function updateUserToken(token) {
  authenticationService.updateCurrentUser(token);
}

// fetch data
const requestData = async (
  url,
  method,
  payload,
  currentUser,
  signal,
) => {
  try {
    const options = {
      method,
      url,
      data: payload,
      params: {},
      headers: { Authorization: `Bearer ${currentUser}` },
      signal,
    };

    const response = await axios(options);

    // from returned response
    const newToken =
      response.headers['x-amzn-remapped-authorization'];
    if (newToken) updateUserToken(newToken);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const SecurityAndPrivacy = props => {
  const { fields, token, tokenDetails, labels } = props;
  const { countryCode, userType, sub, sid } = tokenDetails;

  // react router
  const history = useHistory();
  const location = useLocation();

  // create state for loading and error profile and confirmation
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isLoadingQuery, setLoadingQuery] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [retry, setRetry] = useState(-1);

  // user and error are used as query params
  const [userId, setUserId] = useState(null);
  const [isError, setIsError] = useState(false);

  /*
   * Update/Control user id and error mode from query params in the route
   */

  const handleQueryParams = useCallback(function queryParams(ids) {
    // if a param exists in the url without a value, it will return an empty string (eg: &user alone will return '')
    // if it doesnt exist at all, it returns as null, if it's url encoded it will return "null" as a string
    setLoadingQuery(true);
    const { user, error } = ids;

    // set the user id
    if (user !== 'null') {
      setUserId(user);
    } else {
      setUserId(0);
    }

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
        includeCarer: true,
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

  // return an array with the first item (Single tab view on S&P page)
  const userList =
    (updatedUserList && [updatedUserList[0]]) ||
    (isError && defaultUserList) ||
    null;

  /*
   * Fetch User data
   */

  const abortController = new AbortController();
  const signal = abortController.signal;

  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    // get the cochlear.com website corresponding to the user token
    const countryStr = getCountryCochlearCom(countryCode);
    try {
      const data = await requestData(
        `${identityAPI}?id=${userList[userId].userId}`,
        'get',
        {},
        token,
        signal,
      );

      if (!signal.aborted) {
        setUserData(data);
      }
    } catch (err) {
      if (!signal.aborted) {
        if (
          err.response &&
          [401, 403].indexOf(err.response.status) !== -1
        ) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.renew(countryStr);
          return false;
        }

        setErrorState(
          `${location.pathname}?account=${sid}&user=${userId}`,
          err,
        );
      }
    } finally {
      if (!signal.aborted) {
        setIsFetchingData(false);
      }
    }
  };

  /*
   * Update login (email or password)
   */

  const [updateType, setUpdateType] = useState(null);
  const updatingLogin = async payload => {
    setUpdateType(payload.type);
    // get the cochlear.com website corresponding to the user token
    const countryStr = getCountryCochlearCom(countryCode);
    setShowConfirmation(true);
    try {
      await requestData(
        `${updateLoginAPI}?id=${userList[userId].userId}`,
        'post',
        payload,
        token,
        signal,
      );
    } catch (err) {
      if (!signal.aborted) {
        if (
          err.response &&
          [401, 403].indexOf(err.response.status) !== -1
        ) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.renew(countryStr);
          return false;
        }

        setErrorState(
          `${location.pathname}?account=${sid}&user=${userId}`,
          err,
        );
      }
    } finally {
      if (!signal.aborted) {
        console.log('completed update');
      }
    }
  };

  useEffect(() => {
    if (userId !== null) fetchUserData();
    return () => {
      abortController.abort();
    };
  }, [userId, retry]);

  /*
   * Read error mode - SC GQL data
   */

  useEffect(() => {
    if (!fields)
      setErrorState(
        `${location.pathname}?account=${sid}&user=${userId}`,
        '',
      );
  }, []);

  /*
   * Configure Order Error view
   * order error screen action button callbacks
   */

  function handleErrorCallback(action) {
    if (action === 'retry') {
      setIsError(false);
      setRetry(prevRetry => prevRetry + 1);
      history.push(
        `${location.pathname}?account=${sid}&user=${userId}`,
      );
    }
    return false;
  }

  const errorConfig = mapErrorConfig(
    props,
    'default', // mode is default
    errorStatus,
    handleErrorCallback,
    labels,
  );

  // Build data
  // --------------------------------
  // Take the data from the api layout render of SecurityAndPrivacy
  // and shape it into desired output for out SecurityAndPrivacy page view

  const viewData = fields.data?.item;

  const mappedData = mapContentData(
    viewData,
    'contentSections', // look for this field to return gql data
  );

  /*
   * config assembled
   */
  const config = {
    mode: 'default',
    tabs: {
      accountId: sid,
      userId,
      labels: {
        promptText: labels['labels.tabs.promptText'],
        promptTextAbbrv: labels['labels.tabs.promptTextAbbrv'],
        type: labels['labels.tabs.tab2Type'],
      },
      tabs: userList, // ONLY THE LOGGED IN USER WILL HAVE A VIEW
    },
    errorView: errorConfig,
    isError,
    isLoading: isFetchingData || isLoadingQuery,
    updateType,
    handleQueryParams,
    routerLink: Link,
    routerLocation: useLocation,
  };

  useEffect(() => {
    if (isLoadingQuery) {
      setLoadingQuery(false);
    }
  }, [isLoadingQuery]);

  if (!userList || isTabsLoading) {
    // no userList (used to create tabs) and isLoading show spinner
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  /*
   * Security and privacy data assembled
   */
  const data = {
    ...mappedData,
    email: userData?.data?.identity?.email || '--',
  };

  return (
    <Router>
      <Route
        path={location.pathname}
        render={props => {
          return (
            <SecuritAndPrivacyView
              {...props}
              config={config}
              data={data}
              handleCallback={updatingLogin}
              handleClose={() => {
                setShowConfirmation(false);
                // const element =
                //   document.getElementsByTagName('MAIN')[0];
                // element.classList.toggle(
                //   CONFIRMATION_BTN_BACKDROP_ACTIVE,
                // );
              }}
              showConfirmation={showConfirmation}
            />
          );
        }}
      />
    </Router>
  );
};

export default withRouter(SecurityAndPrivacy);

SecurityAndPrivacy.propTypes = {
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

SecurityAndPrivacy.defaultProps = {};
