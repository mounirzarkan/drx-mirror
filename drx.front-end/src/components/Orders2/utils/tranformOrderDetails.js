import getStatusLabel from './getStatusLabel';

export default function transformOrderDetails(orders, labels) {
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
      detailedInformation: [
        order.OrderedItem,
        order.ItemDescription,
        getStatusLabel(order.LineStatus, labels)[1],
        order.QuantityOrdered,
        order.TotalSellingPrice,
        order.Hcpc,
      ],
      total: order.TotalSellingPrice,
      headerId: order.HeaderId,
      hcpc: order.Hcpc,
    };
    transformedOrders.push(newOrder);
  });
  return transformedOrders;
}
