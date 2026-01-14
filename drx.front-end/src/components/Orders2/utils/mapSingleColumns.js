export default function mapSingleColumns(
  dataItem,
  locale,
  countryCode,
  isInsuranceOrder,
) {
  const obj = {
    country: countryCode,
    language: locale,
    variant: !isInsuranceOrder
      ? 'details'
      : 'details details--insurance-order',
    highlight: false,
    formats: {
      currency: dataItem && dataItem.currencyFormat.value,
      date: dataItem && dataItem.dateFormat.value,
    },
    columns: dataItem.tableSettings[0].settings
      .filter(x => x.name.toLowerCase() === 'order details')[0]
      .columns.map(x => {
        const column = {
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

        return column;
      }),
  };
  return obj;
}
