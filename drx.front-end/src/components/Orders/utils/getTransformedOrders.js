import getStatusLabel from './getStatusLabel';
// given an array of orders and an object of lables in the requried language
// return the transformed object
export default function getTransformedOrders(orders, labels) {
  const transformedOrders = [];
  orders.forEach(order => {
    const OrderNumberCheck =
      order.OnlineStoreOrderNumber || order.OrderNumber;
    const newOrder = {
      OrderNumberOrderDate: [order.OrderedDate, OrderNumberCheck],
      OrderNo: order.OrderNumber,
      OrderNumber: OrderNumberCheck,
      OrderedDate: order.OrderedDate,
      OrderStatus: getStatusLabel(order.OrderStatus, labels),
      OrderCharges: order.LimitedOrderTotal || '0.00',
      view: order.HeaderId,
      HeaderId: order.HeaderId,
      LimitedOrderTaxesTotal: order.LimitedOrderTaxesTotal,
      LimitedOrderChargesTotal: order.LimitedOrderChargesTotal,
      LimitedOrderLinesTotal: order.LimitedOrderLinesTotal,
      OnlineStoreOrderNumber: order.OnlineStoreOrderNumber,
      LimitedOrderTotal: order.LimitedOrderTotal || '0.00',
    };
    transformedOrders.push(newOrder);
  });
  return transformedOrders;
}
