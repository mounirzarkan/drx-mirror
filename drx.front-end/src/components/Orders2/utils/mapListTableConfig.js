export default function mapListTableConfig(
  countryCode,
  locale,
  dataItem,
  handleDataQuery,
  sid,
  userId,
) {
  const contextMenuItems = [
    {
      onclick: row => {
        handleDataQuery(null, null, {
          userId,
          data: { HeaderId: row.HeaderId },
          accountId: sid,
          view: 'details',
        });
      },
      text: 'Order details',
    },
    {
      onclick: row => {
        handleDataQuery(null, null, {
          userId,
          data: { HeaderId: row.HeaderId },
          accountId: sid,
          view: 'status',
        });
      },
      text: 'Order status',
    },
  ];

  return {
    country: countryCode,
    language: locale,
    variant: 'list',
    highlight: dataItem.highlight.value,
    formats: {
      currency: dataItem.currencyFormat.value,
      date: dataItem.dateFormat.value,
    },
    clickableRow: dataItem.clickableRow.value,
    columns: dataItem.tableSettings[0].settings
      .filter(x => x.name.toLowerCase() === 'order list')[0]
      .columns.map(x => {
        return {
          field: x.apiField?.targetItem?.name,
          display: x.textLabel?.targetItem?.key?.value
            ? `${x.textLabel?.targetItem?.key.value}`
            : '',
          format: {
            type: x.formatType.value,
            items:
              x.formatType.value === 'contextMenu'
                ? contextMenuItems
                : null,
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
    events: {
      // override handle.
      onRowClick: (action, parameters) => {
        // The entire row is clickable
        // This includes the context menu button and dropdown
        // so if the button or dropdownm list is clicked, we want to stop the row click event from executing

        const isButtonItem = parameters.event.target.closest(
          'td[data-nw-table-row="view"]',
        );

        if (isButtonItem) {
          return false;
        }

        // action and parameters are returned from data table
        handleDataQuery(null, action, parameters);
      },
    },
  };
}
