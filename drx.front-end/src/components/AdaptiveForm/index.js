/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  useHistory,
  Link,
} from 'react-router-dom';
import Container from './Container';
import useAccountData from './utils/useAccountData';
import useUserList from '../../utils/useUserList';
import Spinner from '../Shared/Spinner/Spinner';

import UserAboutMe from './utils/UserAboutMe';
import findActiveScenario from './utils/findActiveScenario';
import getUserId from './utils/getUserId';
import { mapTabScenarios } from './utils/mapTabScenarios';

const AdaptiveForm = props => {
  const { fields, token, tokenDetails, labels } = props;
  const { locale, countryCode, userType, sub, sid } = tokenDetails;

  // react router
  const history = useHistory();

  // used to form userList from getAccount request.
  const [
    userRequest,
    // , setUserRequest
  ] = useState({
    targetUserId: sub,
    currentUser: token,
  });

  // gets userList after user has updated their information.

  // index of user, can be used with userList to extract user information.

  const [userId, setUserId] = useState(sub);
  const [userIndex, setUserIndex] = useState(0);
  const [isLoadingQuery, setIsLoadingQuery] = useState(true);
  // returned from the failed submission or retrieval
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMode, setErrorMode] = useState('');
  const [isError, setIsError] = useState(false);

  const {
    // isLoading: isTabsLoading,
    // error: tabsError,
    data: updatedUserList,
    setData: setUpdatedUserList,
  } = useUserList(
    userRequest,
    {
      includeCarer: true,
      userType,
      sub,
      countryCode,
    },
    labels,
    () => {},
    // error => {
    //   const { response } = error;
    //   setIsError(true);
    //   setErrorStatus(response?.status);
    //   setErrorMode('read');
    //   return response?.status;
    // },
  );

  const [isDataLoading, data, setData] = useAccountData(
    userIndex,
    userId,
    token,
    response => {
      setErrorStatus(response);
      setErrorMode('read');
      setIsError(true);
      history.push(
        `${location.pathname}?account=${sid}&user=${userId}&error=${response}`,
      );
    },
    { includeCarer: true, userType, sub },
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
  // use updatedUserList when user updates their information and is a carer else use userList provided by useAccountData or the defaultUserList.
  const userList =
    updatedUserList ||
    // data?.userList ||
    (isError && defaultUserList) ||
    null;

  const handleQueryParams = useCallback(
    obj => {
      // if a param exists in the url without a value, it will return an empty string (eg: &user alone will return '')
      // if it doesnt exist at all, it returns as null, if it's url encoded it will return "null" as a string
      setIsLoadingQuery(true);
      const { user, error } = obj;

      // set the user id
      const userTabIndex = user !== 'null' ? Number(user) : 0;
      setUserIndex(userTabIndex);
      setUserId(getUserId(userTabIndex, sub, userList));

      // set the error mode
      if (error !== null) {
        setIsError(true);
        setErrorStatus(error);
        setErrorMode('read');
      } else {
        setIsError(false);
        setErrorStatus('');
        setErrorMode('');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userList],
  );

  // create about me user to scenario selection.

  const userAboutMe = new UserAboutMe(
    userType,
    Number(fields?.data?.tabs?.minimumAge?.numberValue) || undefined,
    data?.personal?.dateOfBirth?.value,
    data?.address?.isRestricted === true,
    data?.carers?.phones?.value?.length > 0,
    userIndex,
    fields?.data?.tabs?.addressAPIStateTypeId?.value,
    fields?.data?.tabs?.addressAPIStateName?.value,
  );

  const [errorFormView, setErrorFormView] = useState('');
  const handleErrorCallback = action => {
    if (action === 'retry-submit') {
      setErrorFormView('');
      setIsError(false);
      setErrorStatus('');
      setErrorMode('');
    }
    return false;
  };

  const onErrorHandle = (view, code) => {
    setIsError(true);
    setErrorMode('submit');
    setErrorFormView(view);
    setErrorStatus(code);
  };

  const scenarios = mapTabScenarios(
    locale,
    countryCode,
    fields.data.tabs,
    errorMode,
    errorStatus,
    handleErrorCallback,
    labels,
  );

  const config = {
    callbackParent: () => {
      // setIsLoading(true);
    },
    isLoading: isDataLoading, // || isLoadingQuery,
    handleQueryParams,
    onErrorHandle,
    errorFormView,
    isError,
    errorMode,
    routerLink: Link,
    routerLocation: useLocation,
    tabsData: {
      accountId: sid,
      userId: userIndex,
      labels: {
        promptText:
          labels[
            fields.data.tabs.promptText?.targetItem?.value?.value
          ],
        promptTextAbbrv:
          labels[
            fields.data.tabs.promptTextAbbrv?.targetItem?.value?.value
          ],
        type: labels[
          fields.data.tabs.recipientTab?.targetItem?.value?.value
        ],
      },
      tabs: userList,
    },
  };

  const activeScenario = findActiveScenario(
    userAboutMe,
    scenarios,
    config,
  );
  activeScenario.token = token;

  useEffect(() => {
    if (isLoadingQuery) {
      setIsLoadingQuery(false);
    }
  }, [isLoadingQuery]);

  const location = useLocation();

  const convertPlaceholder = (label, name) => {
    return label.replace('{{firstName}}', name);
  };

  const [showPopOverPrompt, setShowPopOverPrompt] = useState(false);
  const [popOverPromptText, setPopOverPromptText] = useState('');
  const storageName = 'carerPrompt';
  const myStorage = window.sessionStorage.getItem(storageName);

  const handleShowPopOverPrompt = () => {
    if (userType.toLowerCase() === 'carer' && !myStorage) {
      // populate the text
      let text = '';

      // if userIndex is returned as a string, convert to number
      const i = Number(userIndex);

      if (config.tabsData.tabs.length > 2) {
        const multipleRecipientsMe =
          labels['labels.af.actionbar.popup.multipleRecipientsMe'];
        const multipleRecipientsOther = convertPlaceholder(
          labels['labels.af.actionbar.popup.multipleRecipientsOther'],
          config.tabsData.tabs[i].firstName,
        );

        text =
          i === 0 ? multipleRecipientsMe : multipleRecipientsOther;
      } else {
        const singleRecipientMe = convertPlaceholder(
          labels['labels.af.actionbar.popup.singleRecipientMe'],
          config.tabsData.tabs[1].firstName,
        );

        const singleRecipientOther = convertPlaceholder(
          labels['labels.af.actionbar.popup.singleRecipientOther'],
          config.tabsData.tabs[1].firstName,
        );

        text = i === 0 ? singleRecipientMe : singleRecipientOther;
      }

      setShowPopOverPrompt(true);
      setPopOverPromptText(text);
    }
  };

  activeScenario.popOverPrompt = {
    showPopOverPrompt,
    popOverPromptText,
    handleShowPopOverPrompt,
    setShowPopOverPrompt,
    storage: {
      check: 'exists',
      method: 'session',
      name: storageName,
      value: 1,
    },
  };

  activeScenario.handleDataUpdate = (view, updatedData) => {
    setData(prevData => {
      const shallowClone = { ...prevData };
      shallowClone[view] = updatedData;
      return shallowClone;
    });

    // only refresh user data when usertype is a carer
    // receipts scenarios are not displaying this information.
    // if (userType?.toLowerCase() === 'carer') {
    // console.log('updatedData', updatedData);
    if (view === 'personal') {
      const { firstName, lastName } = updatedData;

      const sc = [...updatedUserList];
      sc[userIndex] = {
        ...updatedUserList[userIndex],
        // {
        firstName: firstName?.value,
        lastName: lastName?.value,
        // }
      };
      setUpdatedUserList(sc);
    }

    // }
    // setUserRequest(

    //   { targetUserId: sub, currentUser: token },
    //   // userType?.toLowerCase() === 'carer'
    //   //   ? { targetUserId: sub, currentUser: token }
    //   //   : null,
    // );
  };

  // && (isTabsLoading || isDataLoading)
  if (!userList && isDataLoading) {
    // no userList (used to create tabs) and isLoading show spinner
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <Router>
      <Route
        path={location.pathname}
        render={p => (
          <Container
            {...p}
            config={activeScenario}
            data={{
              ...data,
              errorModes: scenarios.formConfig.errorModes,
            }}
            labels={labels}
          />
        )}
      />
    </Router>
  );
};

export default AdaptiveForm;
