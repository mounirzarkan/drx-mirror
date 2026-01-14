/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { AdaptiveForm } from '@cochlear-design-system/features.adaptiveForms';

import appConfig from '../../config';
import gqlSettings from './gql/getAddressConfig.AF.settings';
import gqlRead from './gql/getAddressConfig.AF.read';
import gqlEdit from './gql/getAddressConfig.AF.edit';
import gqlEditDefault from './gql/getAddressConfig.AF.edit.default';
import gqlList from './gql/getAddressConfig.AF.list';
import gqlModal from './gql/getAddressConfig.AF.modal';

import useQueryParams from './utils/useQueryParams';
import updateModel from './utils/updateModelBuilder';
import mapAddressConfig from './utils/mapAddressConfig';

import { onSave } from './utils/actions';

const {
  apiEndpoint,
  drxMain,
  googleMapsApiKey,
  gqlUrlToken,
  graphQLEndpoint,
} = appConfig;

const gqlUrl = `${drxMain}${graphQLEndpoint}`;

const AFContainer = props => {
  const { config, labels, data, count } = props;
  const {
    tabsData,
    personalView,
    addressMaintenanceView: addressView,
    contactView,
    combinedView,
    carersView,
    handleQueryParams,
    token,
    popOverPrompt,
    handleDataUpdate,
    routerLink,
    routerLocation,
    name,
    onErrorHandle,
    isError,
    errorMode,
    errorFormView,
    errorView,
    onReadErrorHandle,
    countryCode,
    regionsUrl,
    patientDeceasedData,
  } = config;

  /* Error view: is all the error screen data based on error mode */
  /* Error mode: submit or read error */
  /* is Error: true or false */
  /* error Form View: which form is the error happening in. eg, personalView */

  const {
    personal,
    contact,
    addressMaintenance,
    carers,
    errorModes,
  } = data;

  // section refs
  const tabs = React.createRef();

  let displayContent;

  useQueryParams(handleQueryParams, {
    user: { encoded: true },
    error: { encoded: false },
  });

  const handleUpdatedData = (original, values, view, addressId) => {
    const updatedData = updateModel(
      original,
      values,
      view,
      addressId,
    );
    handleDataUpdate(view, updatedData);
  };

  const onSaveError = (view, response) => {
    onErrorHandle(view, response && response.status);
  };

  const onReadError = (view, response) => {
    onReadErrorHandle(view, response && response.status);
  };

  // about me scenario, eg A1, A2, etc
  const scenarioName = name;

  // ****************************************************************************
  // PERSONAL DETAILS
  // ****************************************************************************

  // Lets build the personal config details form config
  const personalConfig = { ...personalView };
  personalConfig.onSaveHandle = async (formValues, props) => {
    if (props) {
      const res = await onSave(
        formValues,
        props.config.submissionModel,
      ).then(async submittedData => {
        const activeTab = props.config.tabsData.userId;
        const customerIdentifier =
          props.config.tabsData.tabs[activeTab].userId;

        const formData = {
          request: submittedData,
        };
        formData.request.customerIdentifier = customerIdentifier;

        try {
          const response = await axios.patch(
            `${apiEndpoint}/${props.config.submissionUrl}?id=${customerIdentifier}`,
            formData,
            {
              headers: {
                Authorization: 'Bearer ' + props.config.token,
              },
            },
          );
          return response;
        } catch (e) {
          return e;
        }
      });
      if (res?.status === 200) {
        const getPopOverPrompt =
          config.popOverPrompt.handleShowPopOverPrompt();
        config.popOverPrompt.showPopOverPrompt =
          getPopOverPrompt.showPopOverPrompt;
        config.popOverPrompt.popOverPromptText =
          getPopOverPrompt.popOverPromptText;
      } else {
        if (
          res?.response &&
          [401, 403].indexOf(res.response.status) !== -1
        ) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.renew();
          return false;
        }
        onSaveError('personalView', res?.response);
        throw new Error();
      }
      return res;
    }
    return undefined;
  };
  personalConfig.onSaveErrorHandle = response => {
    onSaveError('personalView', response?.response);
  };

  // after success and returned to read mode
  personalConfig.onPostSubmission = (formValues, props) => {
    // convert data and update the read mode with the successfully submitted data
    onSave(formValues, props.config.submissionModel).then(
      submittedData => {
        handleUpdatedData(
          props.data,
          submittedData,
          props.config.submissionModel,
        );
      },
    );
  };

  // ****************************************************************************
  // ##END: PERSONAL DETAILS
  // ****************************************************************************

  // ****************************************************************************
  // ADDRESS DETAILS
  // ****************************************************************************

  const [apiError, setApiError] = useState(false);
  const [addressFormData, setAddressFormData] = useState(null);

  const [getConfigLoading, setGetConfigLoading] = useState(true);
  const getConfig = async () => {
    setGetConfigLoading(true);

    // PR uses the US node for about me > adaptive forms
    const aboutMeCountry = countryCode !== 'PR' ? countryCode : 'US';

    try {
      // get config

      const settings = await axios.post(
        gqlUrl,
        {
          query: gqlSettings(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      const read = await axios.post(
        gqlUrl,
        {
          query: gqlRead(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      const edit = await axios.post(
        gqlUrl,
        {
          query: gqlEdit(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );
      const editDefault = await axios.post(
        gqlUrl,
        {
          query: gqlEditDefault(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );
      const list = await axios.post(
        gqlUrl,
        {
          query: gqlList(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );
      const modal = await axios.post(
        gqlUrl,
        {
          query: gqlModal(countryCode), // queries the address node
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      Promise.all([
        settings,
        read,
        edit,
        editDefault,
        list,
        modal,
      ]).then(values => {
        let data = {
          settings: values[0].data.data.settings,
          read: values[1].data.data.read,
          edit: values[2].data.data.edit,
          editDefault: values[3].data.data.editDefault,
          list: values[4].data.data.list,
          modal: values[5].data.data.modal,
        };

        setAddressFormData({ data });
        setGetConfigLoading(false);
      });
    } catch (error) {
      onReadError('read', error.response);
      setAddressFormData({});
      setApiError(true);
      setGetConfigLoading(false);
    }
  };
  const [lookupStates, setLookupStates] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [postcodeMask, setPostcodeMask] = useState('');

  const checkStateName =
    addressView?.addressAPIStateName === 'short_name';
  const [initLoading, setInitLoading] = useState(true);
  const init = async () => {
    setInitLoading(true);
    try {
      await axios.get(regionsUrl).then(response => {
        const list = response.data.data.regions.map(x => {
          return {
            label: x.name,
            value: checkStateName ? x.abbr : x.name,
          };
        });
        setCountryStates(list);
        // ready made array, used for JP lookup
        setLookupStates(response.data.data.regions);
        const postCodeFormat =
          response.data.data.country.postalCodeFormat;

        setPostcodeMask(postCodeFormat);
        setInitLoading(false);
      });
    } catch (error) {
      onReadError('read', error.response);
      setApiError(true);
      setInitLoading(false);
    }
  };

  useEffect(() => {
    // address view doesnt exist in combined view
    if (addressView) {
      // address form config data
      getConfig();
      // country states and postcode formats
      init();
    }
  }, []);

  let addressConfig = null;
  let dataNewAddressId = null;

  if (
    addressView &&
    addressFormData &&
    !initLoading &&
    !getConfigLoading &&
    !apiError
  ) {
    const newMappedConfig = mapAddressConfig(
      addressView,
      addressFormData,
      countryStates,
      addressView.mode === 'readWrite'
        ? addressView.onErrorHandle
        : null,
      labels,
    );

    /* root level config */
    addressConfig = { ...newMappedConfig };
    addressConfig.errorView = errorView;
    addressConfig.isError = apiError;
    addressConfig.popOverPrompt = popOverPrompt;
    addressConfig.tabsData = tabsData;
    addressConfig.token = token;

    /* edit level config */
    addressConfig.edit.tabsData = tabsData;
    addressConfig.edit.token = token;
    addressConfig.edit.googleMapsApiKey = `${googleMapsApiKey}&loading=async`;
    addressConfig.edit.apiEndpoint = apiEndpoint; // 'https://sit.api.cochlear.com/drx/v1',
    addressConfig.edit.regionsUrl = regionsUrl; // 'patients/me/address/regions?country=US&lng=en',
    addressConfig.edit.postcodeMask = postcodeMask;

    /* addressMaintenanceConfig */
    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.addressInputConfig.config.popOverPrompt =
      popOverPrompt;

    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.addressInputConfig.config.postcodeMask =
      postcodeMask;
    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.addressInputConfig.config.googleMapsApiKey = `${googleMapsApiKey}&loading=async`;

    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.onSaveHandle =
      async (formValues, props) => {
        // add or change address request
        const isAddAddress = formValues.addressInput ? true : false; // address Input doesnt exist when only changing tags

        if (props) {
          const res = await onSave(
            formValues,
            props.config.submissionModel,
            lookupStates,
          ).then(async submittedData => {
            const activeTab = tabsData.userId;
            const customerIdentifier =
              tabsData.tabs[activeTab].userId;

            submittedData.customerIdentifier = customerIdentifier;

            try {
              let response;
              if (isAddAddress) {
                dataNewAddressId = null; // reset
                // add new or edit existing address
                response = await axios.post(
                  `${apiEndpoint}/${props.config.submissionUrl}?id=${customerIdentifier}`,
                  submittedData,
                  {
                    headers: {
                      Authorization: 'Bearer ' + token,
                    },
                  },
                );
              } else {
                // just change tags on existing address
                response = await axios.patch(
                  `${apiEndpoint}/${props.config.submissionUrl}?id=${customerIdentifier}&addressId=${submittedData.addressId}`,
                  submittedData,
                  {
                    headers: {
                      Authorization: 'Bearer ' + token,
                    },
                  },
                );
              }

              return response;
            } catch (e) {
              return e;
            }
          });

          if (res?.status === 200) {
            if (isAddAddress) {
              dataNewAddressId = res.data?.data?.addressId; // set address Id
            }
            const getPopOverPrompt =
              config.popOverPrompt.handleShowPopOverPrompt();
            config.popOverPrompt.showPopOverPrompt =
              getPopOverPrompt.showPopOverPrompt;
            config.popOverPrompt.popOverPromptText =
              getPopOverPrompt.popOverPromptText;
          } else {
            if (
              res?.response &&
              [401, 403].indexOf(res.response.status) !== -1
            ) {
              // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
              authenticationService.renew();
              return false;
            }
            onSaveError('addressMaintenanceView', res?.response);
            throw new Error();
          }

          return res;
        }

        return undefined;
      };

    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.onSaveErrorHandle =
      response => {
        onSaveError('addressMaintenanceView', response?.response);
      };

    addressConfig.additionalConfig.addressMaintenanceConfig.singleEntryView.addressGeneralConfig.onPostSubmission =
      (formValues, props, initialValues) => {
        // convert data and update the read mode with the successfully submitted data
        onSave(
          formValues,
          props.config.submissionModel,
          lookupStates,
        ).then(submittedData => {
          handleUpdatedData(
            props.data, // initial data
            {
              ...submittedData,
              countryName: props.config.countryName,
            }, // saved data
            props.config.submissionModel, // modal eg; personal, contact, address
            dataNewAddressId,
          );
        });
      };
  }

  // update edit mode to include mask for postcode field if it exists
  const postcodeValidator = addressConfig?.edit?.fields
    ?.filter(x => x.id === 'postcode')[0]
    .validators.filter(y => y.key === 'postcode')[0];
  if (postcodeValidator) postcodeValidator.mask = postcodeMask;

  // ****************************************************************************
  // ##END: ADDRESS DETAILS
  // ****************************************************************************

  // ****************************************************************************
  // CONTACT DETAILS
  // ****************************************************************************

  // Lets build the contact config details form config
  const contactConfig = {
    ...contactView,
  };

  contactConfig?.read?.elements.map(element => {
    if (element.id === 'Mobile phone') {
      element.validators?.map(validator => {
        if (validator.apifield === 'mobilePhone')
          validator.apifield = 'mobilePhone.Number';
        if (validator.mask === 'readMode')
          validator.phoneNumberLength =
            contactConfig?.edit?.phoneNumberLength;
      });
    }
    if (element.id === 'Home phone') {
      element.validators?.map(validator => {
        if (validator.apifield === 'homePhone')
          validator.apifield = 'homePhone.Number';
        if (validator.mask === 'readMode')
          validator.phoneNumberLength =
            contactConfig?.edit?.phoneNumberLength;
      });
    }
  });

  contactConfig.onSaveHandle = async (formValues, props) => {
    if (props) {
      const res = await onSave(
        formValues,
        props.config.submissionModel,
      ).then(async submittedData => {
        const activeTab = props.config.tabsData.userId;
        const customerIdentifier =
          props.config.tabsData.tabs[activeTab].userId;
        const formData = {
          request: submittedData,
        };
        formData.request.customerIdentifier = customerIdentifier;
        try {
          const response = await axios.patch(
            `${apiEndpoint}/${props.config.submissionUrl}?id=${customerIdentifier}`,
            formData,
            {
              headers: {
                Authorization: 'Bearer ' + props.config.token,
              },
            },
          );
          return response;
        } catch (e) {
          return e;
        }
      });
      if (res?.status === 200) {
        const getPopOverPrompt =
          config.popOverPrompt.handleShowPopOverPrompt();
        config.popOverPrompt.showPopOverPrompt =
          getPopOverPrompt.showPopOverPrompt;
        config.popOverPrompt.popOverPromptText =
          getPopOverPrompt.popOverPromptText;
      } else {
        if (
          res?.response &&
          [401, 403].indexOf(res.response.status) !== -1
        ) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          authenticationService.renew();
          return false;
        }
        onSaveError('contactView', res?.response);
        throw new Error();
      }
      return res;
    }
    return undefined;
  };

  contactConfig.onSaveErrorHandle = response => {
    onSaveError('contactView', response?.response);
  };

  // after success and returned to read mode
  contactConfig.onPostSubmission = (formValues, props) => {
    // convert data and update the read mode with the successfully submitted data
    onSave(formValues, props.config.submissionModel).then(
      submittedData => {
        handleUpdatedData(
          props.data, // original data
          submittedData, // saved data
          props.config.submissionModel, // modal eg; personal, contact, address
        );
      },
    );
  };

  // ****************************************************************************
  // ##END: CONTACT DETAILS
  // ****************************************************************************

  // ********************
  // IS-DECEASED ???
  // *******************
  let deceasedView = personal?.isDeceased?.value || false;

  if (deceasedView) {
    // change all editable forms mode to readOnly
    if (personalConfig) personalConfig.mode = 'readOnly';
    if (addressConfig) addressConfig.mode = 'readOnly';
    if (contactConfig) contactConfig.mode = 'readOnly';
  }

  const deceasedConfig = {
    body: patientDeceasedData
      ? labels[
          patientDeceasedData.patientDeceased.patientDeceasedBody
            .targetItem.key.value
        ]
      : '',
    data: 'personal',
    heading:
      patientDeceasedData?.patientDeceased?.patientDeceasedTitle
        ?.targetItem?.key?.value || '',
    hideToolBar: true,
    id: 'alertView',
    mode: 'editOnly',
    type: 'Alert',
    variant: 'warning',
  };

  // ********************
  // ##END: IS-DECEASED
  // *******************

  // Build views
  // --------------------------------------
  // Only add views for config that exists

  const userViews = [
    deceasedView ? deceasedConfig : undefined,
    personalView ? personalConfig : undefined,
    addressConfig ? addressConfig : undefined,
    contactView ? contactConfig : undefined,
    carersView ? carersView : undefined,
    combinedView ? combinedView : undefined,
  ].filter(x => x !== undefined);

  // if userViews is empty, chances are you are viewing the wrong url
  // change you country/language to match user account
  if (userViews.length === 0)
    console.log(
      'You are viewing the incorrect url for this user, change to :',
      countryCode,
    );

  // only care if addressView is true (addressForm exists for this scenario)
  // update isLoading based on this.
  const isAddressLoading = addressView
    ? getConfigLoading || initLoading
    : false;

  const afLoading =
    config.isLoading || (isAddressLoading && !apiError);

  displayContent = (
    <AdaptiveForm
      key={count.current} // update key on adaptive form to force data update (re-render) on address maintenance view
      config={{
        formType: 'simple',
        isLoading: afLoading,
        errorFormView,
        isError,
        errorMode,
        theme: '',
        tabsData,
        views: userViews,
        errorView,
        handleQueryParams,
        popOverPrompt,
        routerLocation,
        routerLink,
        token,
      }}
      data={{
        adaptiveForms: {
          addressMaintenance,
          personal,
          contact,
          carers: {
            type: 'others',
            values: carers?.names?.value,
          },
        },
        errorModes,
      }}
      labels={{ ...labels }}
    />
  );

  return (
    <div ref={tabs} data-current-active-scenario={scenarioName}>
      {displayContent}
    </div>
  );
};

AFContainer.propTypes = {
  /**
    Data - holds information that is referenced by format.
  */
  data: PropTypes.object.isRequired,
  /**
    config - configuration information
  */
  config: PropTypes.shape({
    tabsData: PropTypes.object,
    personalView: PropTypes.object,
    addressView: PropTypes.object,
    contactView: PropTypes.object,
    combinedView: PropTypes.object,
    carersView: PropTypes.object,
    handleQueryParams: PropTypes.func,
    token: PropTypes.string,
    popOverPrompt: PropTypes.object,
    onErrorHandle: PropTypes.func,
    errorFormView: PropTypes.string,
    errorView: PropTypes.object,
    handleDataUpdate: PropTypes.func,
  }).isRequired,
  /**
    labels - contains label text
  */
  labels: PropTypes.object.isRequired,
};

AFContainer.defaultProps = {};

export default AFContainer;
