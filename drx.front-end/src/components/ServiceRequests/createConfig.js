import { mapTabsConfig } from '../../utils/serviceRequests/mapTabsConfig';
import { mapListConfig } from '../../utils/serviceRequests/mapListConfig';
import { mapDetailConfig } from '../../utils/serviceRequests/mapDetailConfig';
import { mapErrorConfig } from '../../utils/serviceRequests/mapErrorConfig';

export const createConfig = (
  countryCode,
  locale,
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
  listUid,
  detailsUid,
  detailData,
  detailsContent,
  isFetchingList,
  hasData,
  routerLink,
  location,
  handleSortDataChange,
  sortedList,
) => {
  const requestLabels = detailsContent[0]?.data?.data?.labels;
  const deviceLabels = detailsContent[1]?.data?.data?.labels;
  const shippingLabels = detailsContent[2]?.data?.data?.labels;
  const toolbar = detailsContent[3]?.data?.data?.toolbar;
  const detailsConfig = detailsContent[3]?.data?.data?.config;

  return {
    mode,
    tabs: mapTabsConfig(labels, sid, userId, userList),
    list: {
      uId: listUid,
      accountId: sid,
      userId,
      ...mapListConfig(
        countryCode,
        locale,
        labels,
        dataItem,
        handleDataQuery,
        isFetchingList,
        hasData,
        handleSortDataChange,
      ), // ...listTableConfig,
      isFilteredFlag: !hasData ? '*' : undefined,
      noResultsLabel: 'labels.serviceRequests.noDataMessage',
    },
    details: {
      uId: detailsUid,
      accountId: sid,
      userId,
      country: countryCode,
      language: locale,
      mask: dataItem.dateFormat?.value,
      ...mapDetailConfig(
        labels,
        handleDataQuery,
        detailData,
        toolbar?.children,
        requestLabels,
        deviceLabels,
        shippingLabels,
        detailsConfig,
        routerLink,
        location,
        sid,
        userId,
        sortedList,
      ), // ...singleTableConfig,
    },
    errorView: mapErrorConfig(
      dataItem, // props.fields.data.item
      mode,
      errorStatus,
      handleErrorCallback,
      labels,
    ), // errorConfig,
    isError,
    isLoading,
    callbackParent: () => {},
  };
};
