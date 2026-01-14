import adjacentHeaderIds from './adjacentHeaderIds';
import getTotalTaxAmount from './getTotalTaxAmount';
import mapheaderDataConfig from './mapHeaderDataConfig';
import mapTotalDataConfig from './mapTotalDataConfig';
import mapTaxDataConfig from './mapTaxDataConfig';

const getContextMenuItems = (items, updatePath) => {
  const contextMenuItems = items.map(item => {
    return {
      icon: item.icon,
      onclick: item.linkTo
        ? () => {
            updatePath(item.linkTo);
          }
        : item.onHandle,
      text: item.text,
    };
  });
  return contextMenuItems;
};

export default function buildDetailsViewData(
  props,
  labels,
  locale,
  countryCode,
  orderItem,
  detailList,
  sessionLightList,
  orderStatus,
  statusView,
  accountId,
  orderId,
  userId,
  location,
  activeUser,
  routerLink,
  handleNavigateToList,
  handleNavigateToDetails,
  updatePath,
) {
  //  console.log(arguments); // outputs the arguments to the console
  let obj = {};

  let toolbarConfig = {
    toolbarLabel:
      props.fields.data.item.toolbarLabel.targetItem.key.value,
    primaryTarget: props.fields.data.item.primaryTarget?.value,
    secondaryTarget: props.fields.data.item.secondaryTarget?.value,
    text: props.fields.data.item.toolbarLabel?.targetItem.key.value,
    items: props.fields.data.item.toolbarButtons[0].children.map(
      x => {
        return {
          text: x.text.targetItem.key.value,
          type: x.type.value,
        };
      },
    ),
  };

  let formatConfig = {
    currencyFormat: props.fields.data.item.currencyFormat?.value,
    dateFormat: props.fields.data.item.dateFormat?.value,
  };

  let headerDataConfig = mapheaderDataConfig(
    countryCode,
    locale,
    formatConfig.dateFormat,
    labels,
    props,
  );

  let totalDataConfig = mapTotalDataConfig(
    locale,
    countryCode,
    formatConfig.currencyFormat,
  );

  let taxDataConfig = mapTaxDataConfig(
    locale,
    countryCode,
    formatConfig.currencyFormat,
  );

  obj.toolbar = { next: '', prev: '', items: [], title: '' };
  if (orderItem && labels && toolbarConfig) {
    const linkDefaults = {
      align: 'right',
      disabled: false,
      linkTo: '/',
      onHandle: () => {},
      routerLink,
    };

    const { prev, next } = adjacentHeaderIds(
      orderId,
      sessionLightList,
    );

    const orderNo = orderItem[toolbarConfig.primaryTarget]
      ? orderItem[toolbarConfig.primaryTarget]
      : orderItem[toolbarConfig.secondaryTarget];
    const title = `${labels[toolbarConfig.toolbarLabel]}${orderNo}`;

    const toolbarConfigItems =
      prev === undefined || next === undefined
        ? toolbarConfig.items.filter(
            ({ type }) =>
              type !== 'chevron-left' && type !== 'chevron-right',
          )
        : toolbarConfig.items;

    const toolbarItems = toolbarConfigItems.map(
      ({ text, type } = {}) => {
        if (type === 'chevron-left' || type === 'chevron-right') {
          return {
            ...linkDefaults,
            disabled: false,
            linkTo: `${
              location.pathname
            }?account=${accountId}&user=${userId}&order=${
              type === 'chevron-left' ? prev : next
            }&view=${statusView}`,
            onHandle: () => {},
            text: labels[text],
            type,
            icon: type,
            align: 'right',
            iconAlign: 'left',
          };
        }

        return {
          ...linkDefaults,
          disabled: false,
          linkTo: null,
          onHandle: () => {
            window.print();
          },
          text: labels[text],
          icon: 'print',
          type: 'button',
          align: 'right',
          iconAlign: 'left',
        };
      },
    );

    obj.toolbar = {
      prev,
      next,
      title,
      config: {
        defaultSelection: statusView || 'details',
        items: [
          {
            type: 'breadcrumb',
            icon: '',
            sections: [
              {
                action: () => {
                  handleNavigateToList(
                    null,
                    'actions.details.navigateBack',
                    { accountId, userId },
                  );
                },
                text: labels['labels.orders.orderlist.title'],
              },
              {
                action: function noRefCheck() {},
                text: title || '--',
              },
            ],
            align: 'left',
          },
          {
            type: 'text-filter-button',
            icon: 'details',
            text: 'Details',
            onHandle: () => {
              handleNavigateToDetails(null, null, {
                userId,
                data: { HeaderId: orderId },
                accountId,
                view: 'details',
              });
            },
            disabled: true,
            align: 'right',
            iconAlign: 'left',
          },
          {
            type: 'text-filter-button',
            icon: 'status',
            text: 'Status',
            onHandle: () => {
              handleNavigateToDetails(null, null, {
                userId,
                data: { HeaderId: orderId },
                accountId,
                view: 'status',
              });
            },
            disabled: true,
            align: 'right',
            iconAlign: 'none',
          },
          ...toolbarItems,
          {
            type: 'context-menu',
            icon: 'menu',
            sections: getContextMenuItems(toolbarItems, updatePath),
            align: 'right',
          },
        ],
      },
    };
  }

  // OrderDetail header data
  obj.headerItems = { items: [] };
  if (
    orderItem &&
    labels &&
    headerDataConfig &&
    Array.isArray(headerDataConfig.items)
  ) {
    let items = headerDataConfig.items.map(
      ({ id, label, type, target, config, targetPlaceholder }) => {
        let value = orderItem[target] || '';
        if (Array.isArray(target)) {
          value = target
            .map(str => orderItem[str] || undefined)
            .filter(i => i !== undefined);
          if (value.length < 2) {
            value.push('');
          }
          if (
            Array.isArray(targetPlaceholder) &&
            targetPlaceholder.length === value.length
          ) {
            value = targetPlaceholder.map((placeholder, index) => {
              if (
                value[index] !== '' &&
                placeholder.indexOf('$placeholder$') >= 0
              ) {
                return placeholder.replace(
                  '$placeholder$',
                  value[index],
                );
              }
              return value[index];
            });
          }
        }
        return {
          id,
          label,
          type,
          value,
          config,
        };
      },
    );

    const setUser = {
      id: 'order-name',
      label: 'labels.orders.header.items.for',
      type: 'label',
      value: `${activeUser.firstName} ${activeUser.lastName}`,
    };

    items = [setUser, ...items];

    obj.headerItems = { items };
  }

  // OrderDetail total summary and taxes data
  obj.totalData = { items: [] };

  if (
    orderItem &&
    orderStatus &&
    detailList &&
    labels &&
    totalDataConfig &&
    taxDataConfig
  ) {
    const totals = totalDataConfig.items.map(
      ({ id, label, target }) => ({
        id,
        label: labels[label],
        value: orderStatus[target],
      }),
    );

    const taxes = taxDataConfig.items.map(
      ({ id, label, target }) => ({
        id,
        label: labels[label],
        value: orderStatus[target],
      }),
    );

    // Combine the arrays (totals and taxes) and make sure the tax object is at index 1
    const combinedArrays = (arr1, arr2, index) => {
      const combinedArray = [...arr1];
      combinedArray.splice(index, 0, ...arr2);
      return combinedArray;
    };

    const items = combinedArrays(totals, taxes, 1);

    obj.totalData = {
      items,
      config: totalDataConfig.config,
    };
  }
  // Order Status Data
  obj.orderStatus = {
    date: {},
    stage: {},
  };

  if (
    orderItem &&
    detailList &&
    Object.keys(orderStatus).length > 0
  ) {
    obj.orderStatus.date = orderStatus.date;
    obj.orderStatus.stage = orderStatus.stage;
  }

  return obj;
}
