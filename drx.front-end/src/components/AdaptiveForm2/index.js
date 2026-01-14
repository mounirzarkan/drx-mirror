/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  useLocation,
  useHistory,
  Link,
} from 'react-router-dom';
import axios from 'axios';

import AFContainer from './AFContainer';
import Spinner from '../Shared/Spinner/Spinner';

import gqlSettings from './gql/getAboutMeConfig.AF.settings';
import gqlPatientDeceased from './gql/getAboutMeConfig.AF.patientDeceased';

import useUserList from '../../utils/useUserList';
import useAccountData from './utils/useAccountData';
import UserAboutMe from './utils/UserAboutMe';
import findActiveScenario from './utils/findActiveScenario';
import getUserId from './utils/getUserId';
import { mapTabScenarios } from './utils/mapTabScenarios';

import appConfig from '../../config';

const { drxMain, gqlUrlToken, graphQLEndpoint } = appConfig;
const gqlUrl = `${drxMain}${graphQLEndpoint}`;

const AdaptiveForm2 = props => {
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

  const { data: updatedUserList, setData: setUpdatedUserList } =
    useUserList(
      userRequest,
      {
        includeCarer: true,
        userType,
        sub,
        countryCode,
      },
      labels,
      () => {},
    );

  const [isDataLoading = true, data, setData, setIsLoading] =
    useAccountData(
      userIndex,
      userId,
      token,
      response => {
        setIsError(true);
        setErrorStatus(response);
        setErrorMode('read');
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
        setIsLoading(false);
      } else {
        setIsError(false);
        setErrorStatus('');
        setErrorMode('');
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userList],
  );

  // create about me user to scenario selection.
  const userAboutMe = new UserAboutMe(
    userType.toLowerCase() === 'provisional unknown'
      ? 'recipient'
      : userType,
    Number(fields?.data?.tabs?.minimumAge?.numberValue) || undefined,
    data?.personal?.dateOfBirth?.value,
    // when isRestricted is returned from the address api, update the data modal
    data?.addressMaintenance?.isRestricted === true,
    data?.carers?.names?.value?.length > 0,
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
    setErrorMode('submit');
    setErrorFormView(view);
    setErrorStatus(code);
    setIsError(true);
  };

  const onReadErrorHandle = (view, code) => {
    setErrorMode('read');
    setErrorFormView(view);
    setErrorStatus(code);
    setIsError(true);
  };

  const [additionalSettings, setAdditionalSettings] = useState(null);
  const [patientDeceasedData, setPatientDeceasedData] =
    useState(null);

  const [isAdditionalLoading, setIsAdditionalLoading] =
    useState(true);
  // gql queries
  const getAdditionalConfig = async () => {
    setIsAdditionalLoading(true);

    // PR uses the US node for about me > adaptive forms
    const aboutMeCountry = countryCode !== 'PR' ? countryCode : 'US';

    try {
      // get config
      const settings = await axios.post(
        gqlUrl,
        {
          query: gqlSettings(aboutMeCountry), // queries the adaptive forms node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      const patientDeceased = await axios.post(
        gqlUrl,
        {
          query: gqlPatientDeceased(aboutMeCountry), // queries the adaptive forms node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      Promise.all([settings, patientDeceased]).then(values => {
        setAdditionalSettings({
          settings: values[0].data.data.settings,
        });
        setPatientDeceasedData({
          patientDeceased: values[1].data.data.patientDeceased,
        });
        setIsAdditionalLoading(false);
      });
    } catch (error) {
      setIsError(true);
      setErrorStatus(error.response.status);
      setErrorMode('read');
      history.push(
        `${location.pathname}?account=${sid}&user=${userId}&error=${error.response.status}`,
      );
      setAdditionalSettings({});
      setPatientDeceasedData({});
      setIsAdditionalLoading(false);
    }
  };

  useEffect(() => {
    getAdditionalConfig();
  }, []);

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
    callbackParent: () => {},
    isLoading: isDataLoading || isAdditionalLoading,
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
    onReadErrorHandle,
    countryCode,
    regionsUrl: additionalSettings?.settings?.regionsAPI?.value,
    patientDeceasedData,
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

  const count = useRef(0);
  activeScenario.handleDataUpdate = (view, updatedData) => {
    count.current = count.current + 1;
    setData(prevData => {
      const shallowClone = { ...prevData };
      shallowClone[view] = updatedData;
      return shallowClone;
    });

    // only refresh user data when usertype is a carer
    // receipts scenarios are not displaying this information
    if (view === 'personal') {
      const { firstName, lastName } = updatedData;

      const sc = [...updatedUserList];
      sc[userIndex] = {
        ...updatedUserList[userIndex],
        firstName: firstName?.value,
        lastName: lastName?.value,
      };
      setUpdatedUserList(sc);
    }
  };

  const convertPlaceholder = (label, name) => {
    return label.replace('{{firstName}}', name);
  };

  const storageName = 'carerPrompt';
  const myStorage = window.sessionStorage.getItem(storageName);

  const handleShowPopOverPrompt = () => {
    if (userType.toLowerCase() === 'carer' && !!myStorage === false) {
      // populate the text
      let text = '';

      // if userIndex is returned as a string, convert to number
      const i = Number(userIndex);

      if (config.tabsData.tabs.length > 2) {
        const multipleRecipientsMe =
          labels[
            additionalSettings.settings?.message1?.targetItem.key
              .value
          ];
        const multipleRecipientsOther = convertPlaceholder(
          labels[
            additionalSettings.settings?.message2?.targetItem.key
              .value
          ],
          config.tabsData.tabs[i].firstName,
        );

        text =
          i === 0 ? multipleRecipientsMe : multipleRecipientsOther;
      } else {
        const singleRecipientMe = convertPlaceholder(
          labels[
            additionalSettings.settings?.message3?.targetItem.key
              .value
          ],
          config.tabsData.tabs[1].firstName,
        );

        const singleRecipientOther = convertPlaceholder(
          labels[
            additionalSettings.settings?.message4?.targetItem.key
              .value
          ],
          config.tabsData.tabs[1].firstName,
        );

        text = i === 0 ? singleRecipientMe : singleRecipientOther;
      }

      return {
        showPopOverPrompt: true,
        popOverPromptText: text,
      };
    }
    // reset. either not a carer or already shown
    return {
      showPopOverPrompt: false,
      popOverPromptText: '',
    };
  };

  activeScenario.popOverPrompt = {
    showPopOverPrompt: false,
    popOverPromptText: '',
    handleShowPopOverPrompt,
    storage: {
      check: 'exists',
      method: 'session',
      name: storageName,
      value: 1,
    },
  };

  if (
    userList === null ||
    isDataLoading ||
    !activeScenario ||
    isAdditionalLoading
  ) {
    // no userList (used to create tabs) and isLoading show spinner
    return (
      <div>
        <Spinner />
      </div>
    );
  } else {
    return (
      <Router>
        <Route
          path={location.pathname}
          render={p => (
            <AFContainer
              {...p}
              config={activeScenario}
              data={{
                ...data,
                errorModes: scenarios.formConfig.errorModes,
              }}
              labels={labels}
              count={count} // data changes after form submission
            />
          )}
        />
      </Router>
    );
  }
};

export default AdaptiveForm2;
