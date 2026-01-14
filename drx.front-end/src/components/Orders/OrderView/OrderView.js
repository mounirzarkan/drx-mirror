import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ErrorMessage,
  Preloader,
  UserTabs,
} from '@cochlear-design-system/foundation';

// import Tabs from '../../Shared/Tabs/Tabs';
import OrdersList from '../OrderList/OrderList';
import OrderSingle from '../OrderSingle/OrderSingle';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderView = props => {
  const { config, labels, data } = props;

  const query = useQuery();

  // get query params
  const user = encodeURIComponent(query.get('user'));
  const order = encodeURIComponent(query.get('order'));
  const error = query.get('error');

  // callback function passed as prop
  const { handleQueryParams, routerLink, routerLocation } = config;

  // pass query params back to callback function
  React.useEffect(() => {
    const ids = {
      user,
      order,
      error,
    };
    handleQueryParams(ids);
  }, [handleQueryParams, user, order, error]);

  let displayContent;

  if (config.isLoading) {
    displayContent = (
      <Preloader
        style={{ padding: '1.5rem .5rem' }}
        lines={['title', 'label-field', 'label-field']}
      />
    );
  } else if (config.isError) {
    displayContent = (
      <ErrorMessage
        codeLabel={config.errorView.codeLabel}
        errorResponse={config.errorView.errorResponse}
        data={config.errorView.data}
        style={{ paddingTop: '1rem' }}
        mode={config.mode}
        handleCallback={config.errorView.handleCallback}
      />
    );
  } else if (config.mode === 'list') {
    displayContent = (
      <OrdersList
        config={{ ...config.list, routerLink, routerLocation }}
        labels={labels}
        data={data.list}
      />
    );
  } else if (config.mode === 'details') {
    displayContent = (
      <OrderSingle
        config={{ ...config.details, routerLink, routerLocation }}
        labels={labels}
        data={data.details}
      />
    );
  }

  return (
    <UserTabs
      data={{
        content: {
          text: displayContent,
        },
        tabsData: config.tabs,
      }}
      config={{
        isLoading: config.isLoading,
        callbackParent: () => {},
        Link: routerLink,
        routerLocation,
      }}
    />
  );
};

export default OrderView;
