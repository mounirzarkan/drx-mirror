import React from 'react';
import ToolBar from '../../Shared/ToolBar/ToolBar';
import DataTable from '../../Shared/DataTable/DataTable';

const OrdersList = props => {
  const { data, labels, config } = props;
  const { routerLink } = config;

  return (
    <>
      <ToolBar
        backHandle={null}
        backText={labels['labels.orders.orderlist.title']}
        items={[]}
        routerLink={routerLink}
      />
      <DataTable config={config} data={data.table} labels={labels} />
    </>
  );
};

export default OrdersList;
