export default function mapListTableConfig(
  countryCode,
  locale,
  dataItem,
) {
  return {
    country: countryCode,
    language: locale,
    variant: 'list',
    formats: {
      currency: dataItem.currencyFormat.value,
      date: dataItem.dateFormat.value,
    },
    clickableRow: true,
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
  };
}
