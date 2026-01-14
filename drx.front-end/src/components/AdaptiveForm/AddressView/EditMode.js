/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Text,
  TextInput,
  ReadMode,
  FormButtonBar,
} from '@cochlear-design-system/foundation';

import LocationSearchInput from './LocationSearchInput/LocationSearchInput';
import CityStateView from './CityStateView/CityStateView';

import localConfig from '../../../config';
import { authenticationService } from '../../../utils/_services';
import { onValidate, onSave } from './../utils/actions';

const { apiEndpoint } = localConfig;

const EditMode = props => {
  const { labels, config, data } = props;
  const {
    fields,
    loadError,
    postcodeMask,
    saveLabel,
    cancelLabel,
    savingLabel,
    savedLabel,
    focusName,
    onEditHandle,
    onSaveErrorHandle,
    callbackUpdateData,
    token,
    tabsData,
    popOverPrompt,
    addressAPIState,
  } = config;

  const {
    addressId,
    street1: originalStreet1,
    street2: originalStreet2,
    city: originalCity,
    state: originalState,
    postalCode: originalPostcode,
    countryStates,
    countryIso2Code,
  } = data;

  const [street1, setStreet1] = useState(originalStreet1);
  const [street2, setStreet2] = useState(originalStreet2);
  const [city, setCity] = useState(originalCity);
  const [state, setState] = useState(originalState);
  const [postcode, setPostcode] = useState(originalPostcode);
  const [country] = useState(data.countryName);

  const [readOnly, setReadOnly] = useState(!loadError); // true unless the api has a load error
  const enableForm = () => {
    setReadOnly(false);
  };
  const postcodeValidator = fields
    .filter(x => x.id === 'postcode')[0]
    .validators.filter(y => y.key === 'postcode')[0];

  if (postcodeValidator) postcodeValidator.mask = postcodeMask;

  const updateAddress = (obj, formik, updateFields = true) => {
    // update state with new values
    setStreet1(obj.street1);
    setStreet2(obj.street2);
    setCity(obj.city);
    setState(obj.state);
    setPostcode(obj.postcode);

    if (updateFields) {
      Object.entries(obj).forEach(([key, value]) => {
        formik.setFieldTouched(key);
        formik.setFieldValue(key, value);
      });
    }
  };

  const onCancel = () => {
    onEditHandle('');
  };

  const onSaveError = response => {
    onSaveErrorHandle(response);
  };

  const [saveButtonText, setSaveButtonText] = useState(
    labels[saveLabel],
  );

  const [saveButtonProgress, setSaveButtonProgress] = useState(1);

  const onSubmit = (values, { setSubmitting }) => {
    const saveLabels = {
      saving: labels[savingLabel],
      saved: labels[savedLabel],
      save: labels[saveLabel],
    };
    onSave(values, config.submissionModel).then(submittedData => {
      // SAVING - POST FORM DATA
      // ----------------------

      setSaveButtonText(saveLabels.saving);
      setSaveButtonProgress(2);
      const activeTab = tabsData.userId;
      const customerIdentifier = tabsData.tabs[activeTab].userId;
      submittedData.customerIdentifier = customerIdentifier;
      submittedData.addressId = addressId || null;
      submittedData.countryIso2Code =
        countryIso2Code || config.country;

      const resetView = () => {
        setSubmitting(false);
        setSaveButtonProgress(1);
        setSaveButtonText(saveLabels.save);
        popOverPrompt.setShowPopOverPrompt(false);
        onCancel();
      };

      axios
        .post(
          `${apiEndpoint}/${config.submissionUrl}?id=${customerIdentifier}`,
          submittedData,
          {
            headers: { Authorization: 'Bearer ' + token },
          },
        )
        .then(response => {
          if (response.status === 200) {
            // success!!
            setSaveButtonText(saveLabels.saved);
            setSaveButtonProgress(3);

            // update current data state so read mode has the latest values
            callbackUpdateData(props.data, submittedData, 'address');
            const timeoutSeconds = 4000;

            popOverPrompt.handleShowPopOverPrompt();

            let timer = null;

            // after scheduled time, ie a couple seconds, reset the save btn and view back to read mode
            timer = setTimeout(() => {
              resetView();
            }, timeoutSeconds);
            return () => clearTimeout(timer);
          }
          // Returned a validation error from the server
          // got a succesful response but not 200 so something went wrong

          resetView();
          onSaveError(response?.status);
          return () => {};
        })
        .catch(error => {
          const { response } = error;

          if (
            response &&
            [401, 403].indexOf(response.status) !== -1
          ) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            authenticationService.renew();
            return false;
          }
          resetView();
          onSaveError(response?.status);
        });
    });
  };
  return (
    <div className="ccl__view-edit-mode ccl__view-edit-mode--address-view">
      <Formik
        key={readOnly}
        initialValues={
          readOnly
            ? {
                street1: originalStreet1,
                street2: originalStreet2,
                city: originalCity,
                state: originalState,
                postcode: originalPostcode,
                country,
              }
            : {
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                postcode: postcode,
                country,
              }
        }
        validate={values => onValidate(values, fields, labels)}
        onSubmit={onSubmit}
        initialTouched={
          readOnly
            ? {
                // addressLookup:true
                street1: true,
                street2: true,
                city: true,
                state: true,
                postcode: true,
                country: true,
              }
            : {}
        }
        validateOnMount={readOnly}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          dirty,
          isValid,
          setFieldValue,
          setFieldTouched,
        }) => {
          const isManualStreet1Error = !!(
            !readOnly &&
            touched.street1 &&
            errors.street1
          );
          const isManualStreet2Error = !!(
            !readOnly &&
            touched.street2 &&
            errors.street2
          );

          const streetAddress = () => (
            <>
              <TextInput
                data-nw-input={
                  fields.filter(x => x.id === 'street1')[0].id
                }
                readOnly={readOnly}
                name={fields.filter(x => x.id === 'street1')[0].name}
                id={fields.filter(x => x.id === 'street1')[0].id}
                label={
                  labels[
                    fields.filter(x => x.id === 'street1')[0].label
                  ]
                }
                optionalText={
                  labels[
                    fields.filter(x => x.id === 'street1')[0]
                      .optionalText
                  ]
                }
                hint={
                  labels[
                    fields.filter(x => x.id === 'street1')[0].hint
                  ]
                }
                promptText={
                  labels[
                    fields.filter(x => x.id === 'street1')[0]
                      .promptText
                  ]
                }
                disabled={false}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.street1}
                data-nw-error-field={
                  (isManualStreet1Error && 'street1') || undefined
                }
                error={isManualStreet1Error}
                errorMsg={errors.street1}
              />
              <TextInput
                readOnly={readOnly}
                name={fields.filter(x => x.id === 'street2')[0].name}
                id={fields.filter(x => x.id === 'street2')[0].id}
                label={
                  labels[
                    fields.filter(x => x.id === 'street2')[0].label
                  ]
                }
                optionalText={
                  labels[
                    fields.filter(x => x.id === 'street2')[0]
                      .optionalText
                  ]
                }
                hint={
                  labels[
                    fields.filter(x => x.id === 'street2')[0].hint
                  ]
                }
                promptText={
                  labels[
                    fields.filter(x => x.id === 'street2')[0]
                      .promptText
                  ]
                }
                disabled={false}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.street2}
                data-nw-error-field={
                  (isManualStreet2Error && 'street2') || undefined
                }
                error={isManualStreet2Error}
                errorMsg={errors.street2}
              />
            </>
          );

          return (
            <form
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
            >
              <fieldset disabled={isSubmitting}>
                <div className="columns">
                  {/**
                   * If you want a column to only take the space it needs, use the is-narrow modifier.
                   * The other column(s) will fill up the remaining space.
                   */}
                  <div className="column is-narrow">
                    <ReadMode
                      countryCode={config.country}
                      details={[country]}
                      hasCountryFlag
                      title={
                        labels[
                          fields.filter(x => x.id === 'country')[0]
                            .label
                        ]
                      }
                      data-nw-countryofresidence
                    />
                  </div>
                  <div className="column is-hidden-mobile">
                    <Text
                      data-nw-countryofresidencemessage
                      type="small-body-text-italic"
                      content={
                        labels[
                          fields.filter(x => x.id === 'country')[0]
                            .hint
                        ]
                      }
                    />
                  </div>
                </div>

                {!loadError && (
                  <LocationSearchInput
                    error={
                      Object.getOwnPropertyNames(errors)?.length >
                        0 && readOnly
                        ? labels[config.labels.lookupErrorLabel]
                        : undefined
                    }
                    setFocus={
                      focusName !== undefined &&
                      Object.getOwnPropertyNames(errors)?.length > 0
                    }
                    name={config.name}
                    country={config.country}
                    searchCharLength={config.searchCharLength}
                    address={{
                      street1,
                      street2,
                      city,
                      state,
                      postcode,
                    }}
                    optionalText={labels[config.labels.optional]}
                    promptText={labels[config.labels.prompt]}
                    promptMobile={labels[config.labels.promptMobile]}
                    loadingText={labels[config.labels.loading]}
                    addressNotFound={{
                      text: labels[config.labels.addressNotFoundText],
                      button:
                        labels[config.labels.addressNotFoundButton],
                    }}
                    updateAddress={updateAddress}
                    enableForm={enableForm}
                    data-nw-addresslookup
                    formik={{
                      setFieldValue,
                      setFieldTouched,
                    }}
                    addressAPIState={addressAPIState}
                  />
                )}

                {/* swapEditDisplayOrder when you want CityStateView to display before street address 1 and 2 */}

                {!config.swapEditDisplayOrder && streetAddress()}
                <CityStateView
                  config={config}
                  labels={labels}
                  readOnly={readOnly}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  values={values}
                  errors={(!readOnly && errors) || {}}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  countryStates={countryStates}
                />
                {config.swapEditDisplayOrder && streetAddress()}
              </fieldset>

              <div className="ccl__edit-mode__submit">
                <FormButtonBar
                  onCancel={onCancel}
                  saveText={saveButtonText}
                  cancelText={labels[cancelLabel]}
                  dirty={dirty}
                  isValid={isValid}
                  isSubmitting={isSubmitting}
                  saveButtonProgress={saveButtonProgress}
                  popOverPrompt={popOverPrompt}
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditMode;

EditMode.propTypes = {
  /**
    Data - holds referenced information.
  */
  data: PropTypes.object.isRequired,
  /**
    config - configuration information
  */
  config: PropTypes.object.isRequired,
  /**
    labels - contains label text
  */
  labels: PropTypes.object.isRequired,
};

EditMode.defaultProps = {};
