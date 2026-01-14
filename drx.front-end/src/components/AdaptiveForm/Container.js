/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  ErrorMessage,
  Preloader,
  UserTabs,
} from '@cochlear-design-system/foundation';

// import Tabs from '../Shared/Tabs/Tabs';
import AddressView from './AddressView/AddressView';
import FormView from './FormView/FormView';
import ListView from './ListView/ListView';

import useQueryParams from './utils/useQueryParams';
import updateModel from './utils/updateModelBuilder';
import getOffset from '../../utils/getOffset';

const Container = props => {
  const { config, labels, data } = props;

  const {
    tabsData,
    personalView,
    addressView,

    contactView,
    combinedView,
    carersView,
    handleQueryParams,
    token,
    popOverPrompt,
    onErrorHandle,
    errorFormView,
    errorView,
    handleDataUpdate,
    routerLink,
    routerLocation,
    name,
  } = config;

  const { personal, address, phones, carers } = data;
  // section refs
  const tabs = React.createRef();

  let displayContent;

  useQueryParams(handleQueryParams, {
    user: { encoded: true },
    error: { encoded: false },
  });

  // const onErrorHandle = view => {
  //   console.log('🚀 ~ file: Container.js ~ line 35 ~ view', view);
  // };

  const [isEdit, setIsEdit] = useState('');
  const onEditHandle = view => {
    if (isEdit !== '' && tabs?.current) {
      const divOffset = getOffset(tabs.current);

      if (window.pageYOffset > divOffset.top) {
        tabs.current.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      }
    }

    // toggle edit mode to the new view or reset view to read mode
    setIsEdit(prev => (prev === '' ? view : ''));
  };

  // change form edit mode to default when a tab is changed
  const handleResetEdit = () => setIsEdit('');

  const handleUpdatedData = (original, values, view) => {
    const updatedData = updateModel(original, values, view);
    handleDataUpdate(view, updatedData);
  };

  if (config.isLoading) {
    displayContent = (
      <Preloader
        style={{ padding: '1.5rem .5rem' }}
        lines={['title', 'label-field', 'label-field']}
      />
    );
  } else if (config.isError && config.errorMode === 'read') {
    displayContent = (
      <ErrorMessage
        codeLabel={errorView.codeLabel}
        errorResponse={errorView.errorResponse}
        data={errorView.data}
        style={{ paddingTop: '1rem' }}
        mode={errorView.mode}
        handleCallback={errorView.handleCallback}
      />
    );
  } else {
    displayContent = (
      <>
        {personalView && (
          <FormView
            labels={labels}
            config={{
              ...personalView,
              callbackEditHandle: onEditHandle,
              callbackErrorHandle: onErrorHandle,
              callbackUpdateData: handleUpdatedData,
              isEdit,
              token,
              tabsData,
              popOverPrompt,
              errorView,
              errorFormView,
              routerLink,
            }}
            data={personal}
          />
        )}
        {addressView && (
          <AddressView
            labels={labels}
            config={{
              ...addressView,
              callbackEditHandle: onEditHandle,
              callbackErrorHandle: onErrorHandle,
              callbackUpdateData: handleUpdatedData,
              isEdit,
              token,
              tabsData,
              popOverPrompt,
              errorView,
              errorFormView,
              routerLink,
            }}
            data={address}
          />
        )}
        {/* listView */}
        {contactView && (
          <ListView
            labels={labels}
            config={{
              ...contactView,
              callbackEditHandle: onEditHandle,
              callbackErrorHandle: onErrorHandle,
              callbackUpdateData: handleUpdatedData,
              isEdit,
              token,
              tabsData,
              popOverPrompt,
              errorView,
              errorFormView,
              routerLink,
            }}
            data={phones}
          />
        )}
        {carersView && (
          <ListView
            labels={labels}
            config={{ ...carersView, routerLink }}
            data={carers}
          />
        )}
        {combinedView && (
          <FormView
            labels={labels}
            config={{ ...combinedView, routerLink }}
            data={personal}
          />
        )}
      </>
    );
  }

  return (
    <div ref={tabs} data-current-active-scenario={name}>
      <UserTabs
        data={{
          content: {
            text: displayContent,
          },
          tabsData,
        }}
        config={{
          isLoading: config.isLoading,
          callbackParent: handleResetEdit,
          Link: routerLink,
          routerLocation,
        }}
      />
    </div>
  );
};
Container.propTypes = {
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

Container.defaultProps = {};

export default Container;
