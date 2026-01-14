import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Formik, FieldArray } from 'formik';
import axios from 'axios';

import { FormButtonBar } from '@cochlear-design-system/foundation';

import config from '../../../config';
import { authenticationService } from '../../../utils/_services';
import mapContactEditConfig from './../utils/mapContactEditConfig';
import convertContactEditData from './../utils/convertContactEditData';
import { onValidate, onSave } from './../utils/actions';
import { renderEditList } from './../utils/RenderFields';

const { apiEndpoint } = config;

const EditMode = props => {
  const { labels, data, config } = props;
  const {
    saveLabel,
    savedLabel,
    savingLabel,
    cancelLabel,
    country,
    elements,
    onEditHandle,
    onSaveErrorHandle,
    callbackUpdateData,
    token,
    tabsData,
    popOverPrompt,
  } = config;

  const contactConfig = mapContactEditConfig(config, labels);
  const nextId = useRef(0);

  const [numbers] = useState(() => {
    const clonedData = convertContactEditData(data, country);
    let numbersState = clonedData?.phones?.value?.map(pn => {
      return { ...pn, id: ++nextId.current };
    });
    if (numbersState?.length === 0) {
      numbersState = [{ id: ++nextId.current }];
    }
    return numbersState;
  });

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
  const saveLabels = {
    saving: labels[savingLabel],
    saved: labels[savedLabel],
    save: labels[saveLabel],
  };
  const onSubmit = (values, initialValues, { setSubmitting }) => {
    onSave(values, config.submissionModel, initialValues).then(
      submittedData => {
        // SAVING - POST FORM DATA
        // ----------------------

        setSaveButtonText(saveLabels.saving);
        setSaveButtonProgress(2);

        const activeTab = tabsData.userId;
        const customerIdentifier = tabsData.tabs[activeTab].userId;

        const formData = {
          request: submittedData,
        };
        formData.request.customerIdentifier = customerIdentifier;

        const resetView = () => {
          setSubmitting(false);
          setSaveButtonProgress(1);
          setSaveButtonText(saveLabels.save);
          popOverPrompt.setShowPopOverPrompt(false);
          onCancel();
        };

        axios
          .patch(
            `${apiEndpoint}/${config.submissionUrl}?id=${customerIdentifier}`,
            formData,
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

              callbackUpdateData(props.data, submittedData, 'phones');
              const timeoutSeconds = 4000;
              // postcodeMask;

              popOverPrompt.handleShowPopOverPrompt();

              let timer = null;

              // after scheduled time, ie a couple seconds, reset the save btn and view back to read mode
              timer = setTimeout(() => {
                resetView();
              }, timeoutSeconds);
              return () => clearTimeout(timer);
            } else {
              // Returned a validation error from the server
              // got a succesful response but not 200 so something went wrong

              resetView();
              onSaveError(response?.status);
            }
          })
          .catch(error => {
            const { response } = error;
            // console.log('Error', error);
            // console.log('Error response', response);

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
      },
    );
  };

  const initialErrors = onValidate(
    { numbers },
    elements,
    labels,
    config.type,
  );
  return (
    <div className="ccl__list-edit-mode">
      <Formik
        initialValues={{ numbers }}
        validate={values =>
          onValidate(values, elements, labels, config.type)
        }
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values, numbers, { setSubmitting });
        }}
        initialTouched={initialErrors}
        initialErrors={initialErrors}
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
        }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={isSubmitting}>
                <FieldArray
                  name="numbers"
                  render={arrayHelpers => {
                    const handleRemove = index =>
                      arrayHelpers.remove(index);

                    const handleReplace = (index, obj) =>
                      arrayHelpers.replace(index, {
                        ...obj,
                        id: ++nextId.current,
                      });

                    const handleAdd = () => {
                      arrayHelpers.push({
                        id: ++nextId.current,
                        country,
                        ocSms: null,
                      });
                    };

                    return renderEditList(
                      labels,
                      contactConfig,
                      values?.numbers,
                      isSubmitting,
                      touched,
                      errors,
                      values,
                      isValid,
                      handleBlur,
                      handleChange,
                      handleRemove,
                      handleReplace,
                      handleAdd,
                    );
                  }}
                />
              </fieldset>
              <div className="ccl__list-edit-mode__form__submit">
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

EditMode.propTypes = {
  /**
    Data - holds information that is referenced by format.
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

EditMode.defaultProps = {
  data: {},
  config: { elements: [] },
  labels: {},
};

export default EditMode;
