/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ErrorMessage } from '@cochlear-design-system/foundation';

import EditMode from './EditMode';
import ReadMode from './ReadMode';

import renderDetailActionBar from './../utils/renderDetailActionBar';
import mapAccountConfig from './../utils/mapAccountConfig';
import convertReadData from './../utils/convertReadData';

const FormView = props => {
  const { labels, config: formViewConfig, data } = props;
  const {
    country,
    language,
    mask,
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
    routerLink,
  } = formViewConfig;

  // on initial render, convert the data and display
  const [readData, setReadData] = useState(() => {
    if (data) {
      // converts to information to display for ReadMode
      const clonedData = convertReadData(data, {
        country,
        language,
        mask,
      });
      return clonedData;
    }
    return {};
  });

  // after data update, convert udated data and display
  useEffect(
    () => {
      if (data) {
        // converts to information to display for ReadMode
        const clonedData = convertReadData(data, {
          country,
          language,
          mask,
        });
        setReadData(clonedData);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  // element to focus on when EditMode renders.
  const [focusName, setFocusName] = useState(undefined);

  // used for ReadMode error message click
  const onErrorHandle = name => {
    setFocusName(name);
    callbackEditHandle(config.id);
  };

  // maps SC configuration.
  const config = mapAccountConfig(
    formViewConfig,
    focusName,
    mode === 'readWrite' ? onErrorHandle : null,
  );

  useEffect(() => {
    if (focusName) {
      setFocusName(undefined);
    }
  }, [focusName]);

  const onEditHandle = () => {
    callbackEditHandle(config.id);
  };

  const onSaveErrorHandle = response => {
    callbackErrorHandle(config.id, response);
  };

  return (
    <section
      className="ccl-c-form-section"
      data-nw-about-me-section={config.id}
      data-nw-date-format={mask}
    >
      {/* {isLoading && (
        <Preloader lines={['title', 'label-field', 'label-field']} />
      )} */}

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
      ) : isEdit === config.id ? (
        <EditMode
          labels={labels}
          config={{
            ...config.edit,
            onEditHandle,
            onSaveErrorHandle,
            callbackUpdateData,
            token,
            tabsData,
            popOverPrompt,
          }}
          data={data}
        />
      ) : (
        <ReadMode
          labels={labels}
          config={config?.read}
          data={readData}
        />
      )}
    </section>
  );
};

export default FormView;
