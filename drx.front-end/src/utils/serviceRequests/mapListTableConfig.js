export default function mapListTableConfig(
  countryCode,
  locale,
  dataItem,
) {
  return {
    country: countryCode,
    language: locale,
    formats: {
      currency: dataItem.currencyFormat || 'USD',
      date: dataItem.dateFormat || 'mmm dd yyyy',
    },
    columns: dataItem.listView[0]?.table[0]?.columns?.map(x => {
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
        default: x.sortOrder.value,
        alignment: x.alignment.value,
        restrictWidth: x.restrictWidth.boolValue,
      };
    }),
    variant: 'list',
    highlight: false,
    clickableRow: true,
    lazyLoadOptions: {
      loadMoreText: 'labels.equipement.lazyLoadOptions.loadMoreText',
      pageSize: 20,
    },
    mode: 'lazy',
    events: {
      // override handle.
      onSort: () => {
        // console.log('Sorting function called');
      },
      onLoadMore: () => {
        // console.log('Load more function called');
      },
      onRowClick: () => {
        // console.log('Row click function called');
      },
    },
    // TODO: Add toolbar info here and remove from list.js
    // TODO: All routing info added
  };
}
