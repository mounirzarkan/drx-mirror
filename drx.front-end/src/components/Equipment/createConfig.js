import { mapTabsConfig } from '../../utils/equipment/mapTabsConfig';
import { mapListConfig } from '../../utils/equipment/mapListConfig';
import { mapDetailConfig } from '../../utils/equipment/mapDetailConfig';
import { mapErrorConfig } from '../../utils/equipment/mapErrorConfig';

export const createConfig = (
  countryCode,
  locale,
  sortBy,
  orderBy,
  mode,
  labels,
  sid,
  userId,
  userList,
  isError,
  isLoading,
  dataItem,
  errorStatus,
  handleErrorCallback,
  handleDataQuery,
  activeFilter,
  listUid,
  detailsUid,
  detailData,
  toolbarLinks,
  group,
  isFetchingList,
  hasData,
) => {
  /* Dynamically add the labels value for the empty equipment category message */
  const mLabels = labels;
  // get the current category name (eg, Sound processors)
  const category = labels[activeFilter.mobileColumnLabel];

  const categoryLabelKey =
    'labels.equipment.messages.noCategoryItems';

  // get the category message
  const categoryMsg = labels[categoryLabelKey];
  // swap out placeholder string with category
  const completeCategoryMsg = categoryMsg?.replace(
    '{{deviceType}}',
    category,
  );
  // update label value with updated value
  mLabels['labels.equipment.messages.category'] = completeCategoryMsg;

  return {
    mode,
    tabs: mapTabsConfig(mLabels, sid, userId, userList),
    list: {
      uId: listUid,
      accountId: sid,
      userId,
      ...mapListConfig(
        countryCode,
        locale,
        mLabels,
        sortBy,
        orderBy,
        dataItem,
        handleDataQuery,
        activeFilter,
        group,
        isFetchingList,
        hasData,
      ), // ...listTableConfig,
      isFilteredFlag: !hasData ? '*' : undefined,
      noResultsLabel:
        activeFilter.icon === 'apps'
          ? dataItem?.emptyList?.targetItem?.key?.value
          : 'labels.equipment.messages.category',
    },
    details: {
      showRaiseSrButton: true,
      uId: detailsUid,
      accountId: sid,
      userId,
      country: countryCode,
      language: locale,
      mask: dataItem.dateFormat?.value,
      ...mapDetailConfig(
        mLabels,
        handleDataQuery,
        detailData,
        toolbarLinks,
      ), // ...singleTableConfig,
    },
    errorView: mapErrorConfig(
      dataItem, // props.fields.data.item
      mode,
      errorStatus,
      handleErrorCallback,
      mLabels,
    ), // errorConfig,
    isError,
    isLoading,
    callbackParent: () => {},
  };
};
