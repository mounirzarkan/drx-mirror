export const actionDataQuery = (queryData, action, parameters) => {
  let state = { ...queryData };
  // let linkData = null;
  switch (action) {
    // SORTING
    case 'actions.sorting.default':
      state.order = undefined;
      state.sort = undefined;
      state.page = 0;
      state.group = 0;
      break;
    case 'actions.sorting.sortByField':
    case 'actions.sorting.sortByWarranty': {
      const { order: orderField, field } = parameters;
      state.order = orderField;
      state.sort = field;
      state.page = 0;
      state.group = 1;
      break;
    }

    // FILTERING
    case 'actions.filtering.keyValue': {
      const { field, value } = parameters;
      state.filter = field;
      state.filterValue = value;
      state.page = 0;
      break;
    }

    // LAZY LOAD PAGINATION
    case 'actions.dataTable.page': {
      state.page = parameters;
      break;
    }

    // DETAILS VIEW
    case 'actions.dataTable.rowDetails': {
      const { data: row } = parameters;
      state.id = row.id;
      break;
    }

    case 'actions.tabs.change.user': {
      const { nextUserId } = parameters;
      state = {
        user: nextUserId,
        sort: 'purchaseDate',
        order: 'desc',
      };
      break;
    }
    case 'actions.details.navigateBack': {
      delete state.id;
      break;
    }
    default:
      break;
  }

  return state;
};
