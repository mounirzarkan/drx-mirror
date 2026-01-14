import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';

import { FormButtonBar } from '@cochlear-design-system/foundation';

import config from '../../../config';
import { authenticationService } from '../../../utils/_services';
import { renderEditElement } from './../utils/RenderFields';
import { onValidate, onSave } from './../utils/actions';
import buildinitialValues from './../utils/buildinitialValues';

const { apiEndpoint } = config;

const EditMode = props => {
  const { data, labels, config } = props;
  const {
    saveLabel,
    savedLabel,
    savingLabel,
    cancelLabel,
    focusName,
    elements,
    onEditHandle,
    onSaveErrorHandle,
    callbackUpdateData,
    token,
    tabsData,
    popOverPrompt,
  } = config;

  useEffect(() => {}, [elements]);

  const editElements = (
    touched,
    errors,
    handleChange,
    handleBlur,
    values,
  ) => {
    return elements.map(elementConfig => {
      return (
        <div
          className="ccl__edit-mode__element"
          key={elementConfig.apifield}
        >
          {renderEditElement(
            data,
            labels,
            elementConfig,
            focusName,
            touched,
            errors,
            handleChange,
            handleBlur,
            values,
          )}
        </div>
      );
    });
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
  const saveLabels = {
    saving: labels[savingLabel],
    saved: labels[savedLabel],
    save: labels[saveLabel],
  };

  const onSubmit = (values, { setSubmitting }) => {
    onSave(values, config.submissionModel).then(submittedData => {
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
            callbackUpdateData(props.data, submittedData, 'personal');

            // console.log('updated data');
            const timeoutSeconds = 4000;

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
    });
  };

  const initialValues = buildinitialValues(elements, data);
  const initialErrors = onValidate(initialValues, elements, labels);
  return (
    <div className="ccl__view-edit-mode ccl__view-edit-mode--form-view">
      <Formik
        initialValues={initialValues}
        validate={values => onValidate(values, elements, labels)}
        onSubmit={onSubmit}
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
          //setFieldTouched,
        }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={isSubmitting}>
                {editElements(
                  touched,
                  errors,
                  handleChange,
                  handleBlur,
                  values,
                )}
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

EditMode.defaultProps = {
  data: {},
  config: { elements: [] },
  labels: {},
};
