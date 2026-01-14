import adjacentHeaderIds from './adjacentHeaderIds';
import mapheaderDataConfig from './mapHeaderDataConfig';
import mapTotalDataConfig from './mapTotalDataConfig';
import mapTaxDataConfig from './mapTaxDataConfig';

export default function buildDetailsViewData(
  props,
  labels,
  locale,
  countryCode,
  orderItem,
  detailList,
  sessionLightList,
  accountId,
  orderId,
  userId,
  location,
  activeUser,
  headerFooterDetails,
  orderTotals,
) {
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
            disabled: false,
            linkTo: `${
              location.pathname
            }?account=${accountId}&user=${userId}&order=${
              type === 'chevron-left' ? prev : next
            }`,
            onHandle: () => {},
            text: labels[text],
            type,
          };
        }
        return {
          disabled: false,
          linkTo: null,
          onHandle: () => {
            window.print();
          },
          text: labels[text],
          type,
        };
      },
    );
    obj.toolbar = { prev, next, title, items: toolbarItems };
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
          label: labels[label],
          type,
          value,
          config,
        };
      },
    );

    // JP user display lastname first
    const setUser = {
      id: 'order-name',
      label: labels['labels.orders.header.items.for'],
      type: 'label',
      value: headerFooterDetails.showGivenNameLast
        ? `${activeUser.lastName} ${activeUser.firstName}`
        : `${activeUser.firstName} ${activeUser.lastName}`,
    };

    items = [setUser, ...items];

    obj.headerItems = { items };
  }

  // OrderDetail total summary and taxes data
  obj.totalData = { items: [] };

  if (
    orderItem &&
    orderTotals &&
    detailList &&
    labels &&
    totalDataConfig &&
    taxDataConfig
  ) {
    const totals = totalDataConfig.items.map(
      ({ id, label, target }) => ({
        id,
        label: labels[label],
        value: orderTotals[target],
      }),
    );

    const taxes = taxDataConfig.items.map(
      ({ id, label, target }) => ({
        id,
        label: labels[label],
        value: orderTotals[target],
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

  return obj;
}
