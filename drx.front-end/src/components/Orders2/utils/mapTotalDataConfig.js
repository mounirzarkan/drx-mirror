export default function mapTotalDataConfig(
  language,
  country,
  currencyFormat,
) {
  return {
    items: [
      {
        id: 'order-amount',
        label: 'labels.orders.total.items.amount',
        target: 'totalItemsAmount',
      },
      {
        id: 'charges',
        label: 'labels.orders.total.items.charges',
        target: 'totalShipping',
      },
      {
        id: 'total',
        label: 'labels.orders.total.items.total',
        target: 'totalAmount',
      },
    ],

    config: {
      country,
      language,
      mask: currencyFormat,
    },
  };
}
