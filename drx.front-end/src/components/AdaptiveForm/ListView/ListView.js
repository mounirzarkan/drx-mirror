import React, { useState, useEffect } from 'react';
import { ErrorMessage } from '@cochlear-design-system/foundation';
import EditMode from './EditMode';
import ReadMode from './ReadMode';
import convertContactReadData from '../utils/convertContactReadData';
import renderDetailActionBar from '../utils/renderDetailActionBar';
import mapListConfig from '../utils/mapListConfig';

// TODO clean up
const ListView = props => {
  const { labels, config: listViewConfig, data } = props;

  const {
    mask,
    mode,
    callbackEditHandle,
    callbackErrorHandle,
    callbackUpdateData,
    isEdit,
    token,
    tabsData,
    popOverPrompt,
    country,
    errorView,
    errorFormView,
    routerLink,
  } = listViewConfig;

  const [readData, setReadData] = useState(() => {
    if (data) {
      // converts to information to display for ReadMode
      return convertContactReadData(data, country);
    }
    return {};
  });

  useEffect(
    () => {
      if (data) {
        // converts to information to display for ReadMode
        setReadData(convertContactReadData(data, country));
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
  const config = mapListConfig(
    listViewConfig,
    focusName,
    mode === 'readWrite' ? onErrorHandle : null,
    mask,
  );

  useEffect(() => {
    if (focusName) {
      setFocusName(undefined);
    }
  }, [focusName]);

  const onEditHandle = () => {
    // setIsEdit(state => !state);
    callbackEditHandle(config.id);
  };

  const onSaveErrorHandle = response => {
    callbackErrorHandle(config.id, response);
  };

  return (
    <section
      className="ccl-c-form-section"
      data-nw-about-me-section={config.id}
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
            type: config.type,
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
          labels={config.id === 'carersView' ? {} : labels}
          data={readData}
          config={config.read}
        />
      )}
    </section>
  );
};

export default ListView;
