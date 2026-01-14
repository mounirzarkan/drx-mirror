/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ErrorMessage,
  Preloader,
} from '@cochlear-design-system/foundation';

import { useLoadScript } from '@react-google-maps/api';

import EditMode from './EditMode';
import ReadMode from './ReadMode';

// utilities and helper functions
import appConfig from '../../../config';
import gqlSettings from '../../../gql/getAddressConfig.settings';
import gqlRead from '../../../gql/getAddressConfig.read';
import gqlEdit from '../../../gql/getAddressConfig.edit';
import countryList from '../../../utils/countryList';
import mapAddressConfig from './../utils/mapAddressConfig';
import renderDetailActionBar from './../utils/renderDetailActionBar';

const {
  apiEndpoint,
  drxMain,
  googleMapsApiKey,
  gqlUrlToken,
  graphQLEndpoint,
} = appConfig;

const regionsAPI = `${apiEndpoint}/utils/regions`;
const gqlUrl = `${drxMain}${graphQLEndpoint}`;

const AddressView = props => {
  const { data, config: addressViewConfig, labels } = props;

  const {
    country,
    language,
    postcode,
    name,
    mode,
    callbackEditHandle,
    callbackErrorHandle,
    callbackUpdateData,
    isEdit,
    token,
    tabsData,
    popOverPrompt,
    errorView,
    errorFormView,
    addressAPIStateTypeId,
    addressAPIStateName,
    routerLink,
  } = addressViewConfig;

  if (data && !data.countryIso2Code) data.countryIso2Code = country;
  if (data && !data.countryName) {
    const countryObject = countryList;
    const getCountry = countryObject.find(o => o.code === country);
    data.countryName = getCountry.name;
  }

  const [formData, setFormData] = useState(null);
  const regionsUrl = `${regionsAPI}?country=${country}&lng=${language}`;
  const [libraries] = useState(['places', 'geometry']);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  const [apiError, setApiError] = useState(false);

  const getConfig = async () => {
    try {
      // get config

      const settings = await axios.post(
        gqlUrl,
        {
          query: gqlSettings(country),
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      const read = axios.post(
        gqlUrl,
        {
          query: gqlRead(country),
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      const edit = axios.post(
        gqlUrl,
        {
          query: gqlEdit(country),
        },
        {
          headers: {
            Authorization: `Basic ${gqlUrlToken}`,
          },
        },
      );

      Promise.all([settings, read, edit]).then(values => {
        let data = {
          settings: values[0].data.data.settings,
          read: values[1].data.data.read,
          edit: values[2].data.data.edit,
        };
        setFormData({ ...addressViewConfig, data });
      });
    } catch (error) {
      setApiError(true);
    }
  };

  // element to focus on when EditMode renders.
  const [focusName, setFocusName] = useState(undefined);

  // used for ReadMode error message click
  const onErrorHandle = name => {
    setFocusName('addressLookup');
    callbackEditHandle(addressViewConfig.id);
  };

  let config = null;
  // compile component data and configuration
  if (formData) {
    config = mapAddressConfig(
      formData,
      country,
      postcode,
      name,
      regionsUrl,
      addressViewConfig,
      loadError,
      null,
      mode === 'readWrite' ? onErrorHandle : null,
    );
    config.id = addressViewConfig.id;
  }

  const [countryStates, setCountryStates] = useState([]);
  const [postcodeMask, setPostcodeMask] = useState('');

  const useStateName = ['PR', 'JP'];
  const checkStateName = useStateName.includes(country);

  const init = async () => {
    try {
      axios.get(regionsUrl).then(response => {
        const list = response.data.data.regions.map(x => {
          return {
            label: x.name,
            value: checkStateName ? x.name : x.abbr,
          };
        });
        setCountryStates(list);
        const postCodeFormat =
          response.data.data.country.postalCodeFormat;
        setPostcodeMask(postCodeFormat);
      });
    } catch (error) {
      setApiError(true);
    }
  };

  useEffect(() => {
    // form data
    getConfig();
    // country states and postcode formats
    init();
  }, []);

  useEffect(() => {
    if (focusName) {
      setFocusName(undefined);
    }
  }, [focusName]);

  const onEditHandle = () => {
    callbackEditHandle(addressViewConfig.id);
  };
  const onSaveErrorHandle = response => {
    callbackErrorHandle(config.id, response);
  };

  // loading

  return (
    <section
      className="ccl-c-form-section"
      data-nw-about-me-section={addressViewConfig.id}
    >
      {(() => {
        if (!isLoaded || !formData || countryStates === []) {
          return (
            <Preloader
              lines={['title', 'label', 'line', 'line', 'line']}
            />
          );
        }

        if (apiError) {
          return <div>API Error</div>;
        }
        return (
          <>
            {renderDetailActionBar(
              config,
              data,
              isEdit,
              onEditHandle,
              labels,
              errorFormView,
              routerLink,
            )}
            {errorFormView === config.id ? (
              <ErrorMessage
                codeLabel={errorView.codeLabel}
                errorResponse={errorView.errorResponse}
                data={errorView.data}
                style={{ paddingTop: '1rem' }}
                mode={errorView.mode}
                handleCallback={errorView.handleCallback}
              />
            ) : isEdit === addressViewConfig.id ? (
              <EditMode
                config={{
                  ...config.edit,
                  focusName,
                  postcodeMask,
                  onEditHandle,
                  onSaveErrorHandle,
                  callbackUpdateData,
                  token,
                  tabsData,
                  popOverPrompt,
                  addressAPIState: {
                    addressAPIStateTypeId,
                    addressAPIStateName,
                  },
                }}
                data={{ ...data, countryStates }}
                labels={labels}
              />
            ) : (
              <ReadMode
                config={config.read}
                data={data}
                labels={labels}
              />
            )}
          </>
        );
      })()}
    </section>
  );
};

export default AddressView;
