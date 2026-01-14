// temporary conversion, migrate change to CDS
function getColumns(dataItem) {
  return dataItem.listView[0]?.table[0]?.columns.map(x => {
    let display = x.textLabel?.targetItem?.key?.value
      ? `${x.textLabel?.targetItem?.key.value}`
      : '';

    return {
      field: x.apiField?.targetItem?.name,
      display,
      format: {
        type: x.formatType.value,
      },
      hiddenColumnView: x.hiddenColumn.value,
      hiddenColumnLabel: x.hiddenColumnLabel.boolValue,
      sortable: x.sortable.boolValue,
      syncSort: x.syncSort.value,
      default:
        x.sortOrder.value !== '' ? x.sortOrder.value : undefined,
      customSortable: x.sortOrder.value === `custom`,
      alignment: x.alignment.value,
      restrictWidth: x.restrictWidth.boolValue,
    };
  });
}

function mapToolbar(
  labels,
  dataItem,
  handleDataQuery,
  isFetchingList,
) {
  return [
    [
      {
        type: 'breadcrumb',
        icon: '',
        sections: [
          {
            text: labels[
              'labels.serviceRequests.serviceRequestsList.title'
            ],
            action: () => {},
          },
        ],
        align: 'left',
      },
    ],
  ];
}

export const mapListConfig = (
  countryCode,
  locale,
  labels,
  dataItem,
  handleDataQuery,
  isFetchingList,
  hasData,
  handleSortDataChange,
) => {
  return {
    highlight: false,
    clickableRow: true,
    country: countryCode,
    language: locale,
    formats: {
      currency: dataItem.currencyFormat.value,
      date: dataItem.dateFormat.value,
    },
    columns: getColumns(dataItem),
    lazyLoadOptions: {
      loadMoreText: 'labels.equipement.lazyLoadOptions.loadMoreText',
      pageSize: 100,
    },
    mode: 'lazy',
    events: {
      // override handle.
      onSort: (data, action, parameters) => {
        // handle onSort events here.
        // console.log('Sorting function called');
      },
      onLoadMore: parameters => {
        // page number is returned from data table
        // console.log('Load more function called');
        handleDataQuery(null, 'actions.dataTable.page', parameters);
      },
      onRowClick: (action, parameters) => {
        // action and parameters are returned from data table
        // console.log('Row click function called');
        handleDataQuery(null, action, parameters);
      },
    },
    toolbar: {
      items: mapToolbar(
        labels,
        dataItem,
        handleDataQuery,
        isFetchingList,
      )[0],
    },
    handleSortDataChange: parameters => {
      handleSortDataChange(parameters);
    },
  };
};
