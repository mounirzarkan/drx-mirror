import getLanguageCode from '../../utils/getLanguageCode';

// temporary conversion, migrate change to CDS
function convertType(type) {
  switch (type) {
    case 'equipment-model': {
      return 'device.model';
    }
    case 'equipment-warranty': {
      return 'device.warranty';
    }
    case 'equipment-link': {
      return 'equipmentlink';
    }
    default: {
      return type;
    }
  }
}

function getColumns(dataItem, mobileColumnLabel) {
  return dataItem.tableSettings[0].settings
    .filter(x => x.name.toLowerCase() === 'equipement list')[0]
    .columns.map(x => {
      let display = x.textLabel?.targetItem?.key?.value
        ? `${x.textLabel?.targetItem?.key.value}`
        : '';
      if (x.apiField?.targetItem?.name === 'modelDetailData') {
        display = mobileColumnLabel;
      }
      return {
        field: x.apiField?.targetItem?.name,
        display,
        format: {
          type: convertType(x.formatType.value),
        },
        hiddenColumnView: x.hiddenColumn.value,
        hiddenColumnLabel: x.hiddenColumnLabel.boolValue,
        sortable: x.sortable.boolValue,
        syncSort: x.syncSort.value,
        default: null,
        customSortable: x.sortOrder.value === `custom`,
        alignment: x.alignment.value,
        restrictWidth: x.restrictWidth.boolValue,
      };
    });
}
function rowGrouping(dataItem, sortBy) {
  // For purchase grouping set the above sortedByField to 'purchaseDate'
  // groupingOptions: purchaseGroupingOptions,
  // For warranty grouping set the above sortedByField to 'latestWarrantyDate'

  const groups = dataItem?.rowGrouping[0]?.children.map(
    ({ name, apiField, children }) => {
      const grouping = children.map(({ display, option }) => {
        return {
          display: display?.targetItem?.key?.value,
          option: `actions.grouping.${option?.targetItem?.name}`,
        };
      });

      return { name, apiField: apiField?.targetItem?.name, grouping };
    },
  );

  const group = groups.find(({ apiField }) => apiField === sortBy);

  return group?.grouping || [];
}

function getLabel(labels, label) {
  return labels[label];
}

function sortOptions(labels, dataItem) {
  const sortLabel = {
    type: 'MenuHeader',
    text: getLabel(
      labels,
      dataItem?.sortOptions[0]?.sortLabel?.targetItem?.key?.value,
    ), // labels[]
    id: 'table-sort-chevron-button',
  };
  return [
    sortLabel,
    ...dataItem?.sortOptions[0]?.children.map(
      ({ apiField, label, sortOrder, action }) => {
        const field = apiField?.targetItem?.name;
        const order = sortOrder?.targetItem?.name;
        return {
          type: 'CheckOption',
          text: getLabel(labels, label?.targetItem?.key?.value), // 'Purchase date newest on top', // labels[display]
          id: `${field}-${order}`, // `'table-sort-${parameters.field}-${parameters.order}`
          action: `actions.sorting.${action?.targetItem?.name}`,
          parameters: {
            field,
            order,
          },
        };
      },
    ),
  ];
}
function mapToolbar(
  labels,
  dataItem,
  handleDataQuery,
  hasData,
  isFetchingList,
  showAllSelected,
) {
  if (!isFetchingList && showAllSelected && !hasData) {
    // if there is no data at all, update the toolbar config to display as a static title
    return [
      [
        {
          type: 'breadcrumb',
          icon: '',
          sections: [
            {
              text: labels[
                'labels.equipement.details.toolbar.equipment'
              ],
              action: () => {},
            },
          ],
          align: 'left',
        },
      ],
    ];
  }
  return dataItem?.toolbarListButtons?.map(({ children }) => {
    return children?.map(
      ({
        name,
        text,
        type,
        icon,
        iconAlign,
        buttonAlign,
        children: child,
      }) => {
        const sections = type?.value === 'breadcrumb' && [
          {
            action: () => {},
            text: labels[text?.targetItem?.key?.value],
          },
        ];
        return {
          id: name,
          align: buttonAlign?.value,
          icon: icon?.value,
          iconAlign: iconAlign?.value,
          sections,
          onHandle: () => {
            handleDataQuery(undefined, 'actions.filtering.keyValue', {
              field:
                child[0]?.apiField?.targetItem?.name || undefined,
              value: child[0]?.value?.value || undefined,
            });
          },
          text: labels[text?.targetItem?.key?.value],
          type: type?.value,
        };
      },
    );
  });
}
export const mapListConfig = (
  countryCode,
  locale,
  labels,
  sortBy,
  orderBy,
  dataItem,
  handleDataQuery,
  activeFilter,
  group,
  isFetchingList,
  hasData,
) => {
  const showListGrouping = Number.parseInt(group, 10) === 1;
  const sortedByField = showListGrouping ? sortBy : undefined;
  const sortedByOrder = showListGrouping ? orderBy : undefined;
  const showAllSelected = activeFilter.icon === 'apps';
  return {
    highlight: false,
    clickableRow: true,
    country: countryCode,
    language: locale,
    formats: {
      date: dataItem.dateFormat?.value,
      currency: dataItem.currencyFormat?.value,
    },
    columns: getColumns(dataItem, activeFilter?.mobileColumnLabel),
    groupingOptions: rowGrouping(dataItem, sortBy),
    sortedByField,
    sortedByOrder,
    isSortDropUnselectable: true,
    sortOptions: sortOptions(labels, dataItem),
    showGrouping: !!sortBy && showListGrouping,
    lazyLoadOptions: {
      loadMoreText: 'labels.equipement.lazyLoadOptions.loadMoreText',
      pageSize: 20,
    },
    mode: 'lazy',
    events: {
      // override handle.
      onSort: (data, action, parameters) => {
        // handle onSort events here.
        handleDataQuery(
          data,
          action || 'actions.sorting.default',
          parameters,
        );
      },
      onLoadMore: parameters => {
        // page number is returned from data table
        handleDataQuery(null, 'actions.dataTable.page', parameters);
      },
      onRowClick: (action, parameters) => {
        // action and parameters are returned from data table
        handleDataQuery(null, action, parameters);
      },
    },
    toolbar: {
      defaultSelection: activeFilter.icon,
      items: mapToolbar(
        labels,
        dataItem,
        handleDataQuery,
        hasData,
        isFetchingList,
        showAllSelected,
      )[0],
    },
  };
};
