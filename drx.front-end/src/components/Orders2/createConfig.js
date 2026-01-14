import { mapTabsConfig } from './utils/mapTabsConfig';
import mapListTableConfig from './utils/mapListTableConfig';
import mapListRowGroupings from './utils/mapListRowGroupings';
import mapListFilterOptions from './utils/mapListFilterOptions';
import mapDetailsTimelines from './utils/mapDetailsTimelines';
import mapErrorConfig from './utils/mapErrorConfig';
import mapSingleColumns from './utils/mapSingleColumns';

export const createConfig = (
  props,
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
  handleQueryParams,
  handleSortDataChange,
  routerLink,
  routerLocation,
  useHistory,
  handleDataQuery,
  orderStatus,
  isEmpty,
) => {
  const isInsuranceOrder =
    orderStatus?.type?.toUpperCase() === 'CAM-REIMBURSEMENT-ORD';

  // the description that appears below the timeline for insurance orders can be one of two messages
  let insuranceOrderTimlineDescriptionLabel = '';
  if (isInsuranceOrder) {
    insuranceOrderTimlineDescriptionLabel =
      orderStatus.totalAmount < 4000
        ? dataItem?.timelines[0]?.descriptionOptionA?.targetItem?.key
            ?.value
        : dataItem?.timelines[0]?.descriptionOptionB?.targetItem?.key
            ?.value;
  }

  /* Dynamically add the labels value for the empty orders category message */
  const mLabels = labels;

  return {
    mode,
    tabs: mapTabsConfig(mLabels, sid, userId, userList),
    list: {
      uId: userId,
      accountId: sid,
      userId,
      sortedByField: 'orderType',
      showGrouping: true,
      handleSortDataChange: handleSortDataChange,
      groupingOptions: mapListRowGroupings(
        dataItem?.rowGrouping[0]?.children,
      ),
      filterOptions: !isEmpty // dont show the filter list buttons if there is no data
        ? mapListFilterOptions(dataItem?.filterOptions[0]?.children)
        : [],
      ...mapListTableConfig(
        countryCode,
        locale,
        dataItem,
        handleDataQuery,
        sid,
        userId,
      ),
      isFilteredFlag: isEmpty ? '*' : undefined,
      noResultsLabel: 'labels.orders.message',
    },
    details: {
      orderStatus: {
        title: dataItem?.timelines[0]?.title?.targetItem?.key?.value,
        dateLabel:
          dataItem?.timelines[0]?.dateLabel?.targetItem?.key?.value,
        description: insuranceOrderTimlineDescriptionLabel,
        noStatus:
          dataItem?.timelines[0]?.noStatus?.targetItem?.key?.value,
        timeline: {
          flow: [
            mapDetailsTimelines(
              dataItem?.timelines[0]?.children,
              orderStatus,
              labels,
            ),
          ],
        },
      },
      accountId: sid,
      userId,
      ...mapSingleColumns(
        dataItem,
        locale,
        countryCode,
        isInsuranceOrder,
      ),
      handleSortDataChange: handleSortDataChange,
      headerItems: {
        headerItemsTitle: 'labels.orders.header.items.details',
        // displays logo in print view for order details
        logo: {
          src: 'https://assets.cochlear.com/api/public/content/89a2ac1ae1e046069e3b37a3bf54431b?v=015cdf30',
          alt: 'Cochlear',
          width: '126px',
        },
      },
    },
    errorView: mapErrorConfig(
      props, // props.fields.data.item
      mode,
      errorStatus,
      handleErrorCallback,
      mLabels,
    ), // errorConfig,
    isError,
    isLoading,
    handleQueryParams,
    router: {
      Link: routerLink,
      useLocation: routerLocation,
      useHistory: useHistory,
    },
  };
};
