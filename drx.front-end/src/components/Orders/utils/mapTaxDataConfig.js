export default function mapTaxDataConfig(
  language,
  country,
  currencyFormat,
) {
  return {
    items: [
      {
        id: 'tax',
        label: 'labels.orders.total.items.tax',
        target: 'totalTax',
      },
    ],
    config: {
      country,
      language,
      mask: currencyFormat,
    },
  };
}
