export const actionDataQuery = (queryData, action, parameters) => {
  let state = { ...queryData };

  switch (action) {
    // // SORTING
    // case 'actions.sorting.default':
    //   state.order = undefined;
    //   state.sort = undefined;
    //   state.page = 0;
    //   //state.group = 0;
    //   break;

    // case 'actions.sorting.sortByField': {
    //   const { order: orderField, field } = parameters;
    //   state.order = orderField;
    //   state.sort = field;
    //   state.page = 0;
    //   // state.group = 1;
    //   break;
    // }

    // // LAZY LOAD PAGINATION
    // case 'actions.dataTable.page': {
    //   state.page = parameters;
    //   break;
    // }

    // DETAILS VIEW
    case 'actions.dataTable.rowDetails': {
      const { data: row } = parameters;
      state.id = row.requestId;
      break;
    }

    case 'actions.tabs.change.user': {
      const { nextUserId } = parameters;
      state = {
        user: nextUserId,
        // sort: 'status',
        // order: 'asc',
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
