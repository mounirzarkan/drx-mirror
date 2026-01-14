import getStatusLabel from './getStatusLabel';

export default function getTransformedOrderDetails(orders, labels) {
  const transformedOrders = [];
  orders.forEach(order => {
    const newOrder = {
      item: order.OrderLineNumber,
      quantity: order.QuantityOrdered,
      partNumber: order.OrderedItem,
      description: order.ItemDescription,
      status: getStatusLabel(order.LineStatus, labels),
      unitPrice: order.UnitSellingPrice,
      totalPrice: order.TotalSellingPrice,
      taxAmount: order.TaxAmount,
      detailedInformation: [
        order.OrderedItem,
        order.ItemDescription,
        // getStatusLabel returns an array, we just want the label at positon 1 in this instance
        getStatusLabel(order.LineStatus, labels)[1],
        order.QuantityOrdered,
        order.UnitSellingPrice,
      ],
      total: order.TotalSellingPrice,
      headerId: order.HeaderId,
    };
    transformedOrders.push(newOrder);
  });

  return transformedOrders;
}
