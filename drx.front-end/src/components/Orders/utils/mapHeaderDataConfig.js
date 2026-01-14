export default function mapheaderDataConfig(
  countryCode,
  locale,
  mask,
  labels,
  props,
) {
  return {
    items: [
      {
        id: 'order',
        label: 'labels.orders.header.items.order',
        type: 'combined-label',
        targetPlaceholder: [
          '',
          labels['labels.orders.header.items.orderNumber'],
        ],
        target: [
          props.fields.data.item?.primaryTarget?.value,
          props.fields.data.item?.secondaryTarget?.value,
        ],
      },
      {
        config: {
          country: countryCode,
          language: locale,
          mask: mask,
        },
        id: 'order-date',
        label: 'labels.orders.header.items.date',
        type: 'date',
        target: 'OrderedDate',
      },
      {
        id: 'order-status',
        label: 'labels.orders.header.items.status',
        type: 'label-status',
        target: 'OrderStatus',
      },
    ],
  };
}
