export default function mapListFilterOptions(options) {
  let filterArray = [];
  filterArray = options.map(option => {
    return {
      display: option?.label?.targetItem?.key.value,
      action: 'actions.filtering.filterByField',
      parameters: {
        field: 'orderType',
        value: option?.filter?.targetItem?.name,
      },
      icon: option?.icon?.targetItem?.name,
    };
  });

  return filterArray;
}
