import React from 'react';
import { Text } from '@cochlear-design-system/foundation';

import ToolBar from '../../Shared/ToolBar/ToolBar';
import DataTable from '../../Shared/DataTable/DataTable';
import DataHeader from '../../Shared/DataHeader/DataHeader';
import TotalSummary from '../../Shared/TotalSummary/TotalSummary';

const OrderSingle = props => {
  const { config, data, labels } = props;
  const { userId, accountId, routerLink, routerLocation } = config;
  const { toolbar, headerItems, totalData } = data;
  const location = routerLocation();
  return (
    <div>
      <ToolBar
        backHandle={() => {}}
        backLinkTo={`${location?.pathname}?account=${accountId}&user=${userId}`}
        backText={labels['labels.orders.orderlist.title']}
        currentText={toolbar.title}
        items={toolbar.items}
        routerLink={routerLink}
      />

      <DataHeader items={headerItems.items} />
      <DataTable config={config} data={data.table} labels={labels} />
      <hr className="hr is-print-only" />
      <TotalSummary
        data={totalData.items}
        config={totalData.config}
      />
      {config.additionalInformation && (
        <>
          <hr className="hr is-print-only" />
          <Text
            className="is-print-only"
            content={config.additionalInformation}
            isHTML
          />
        </>
      )}
    </div>
  );
};

export default OrderSingle;
