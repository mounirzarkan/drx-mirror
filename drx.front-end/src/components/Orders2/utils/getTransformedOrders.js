import getStatusLabel from './getStatusLabel';

// given an array of orders and an object of lables in the requried language
// return the transformed object
export default function getTransformedOrders(orders, labels) {
  const transformedOrders = [];
  // counter to check if order type of 'insurance' is present
  let count = 0;
  orders.forEach(order => {
    // determine order type
    const orderType =
      order.OrderType.toUpperCase() === 'CAM-REIMBURSEMENT-ORD'
        ? 'Insurance'
        : 'Self Pay';

    count = orderType === 'Insurance' ? count + 1 : count;
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
      orderType,
    };
    transformedOrders.push(newOrder);
  });
  // if count is greater than zero, an order of type insurance exists
  // and we want to show a disclaimer
  const hasInsurance = count > 0 ? true : false;
  return [transformedOrders, hasInsurance];
}

export function getTransformedSageOrders(orders, labels) {
  const transformedOrders = [];
  // counter to check if order type of 'insurance' is present
  let count = 0;
  orders.forEach(order => {
    // determine order type
    const orderType =
      order.OrderType.toUpperCase() === 'CAM-REIMBURSEMENT-ORD'
        ? 'Insurance'
        : 'Self Pay';
    count = orderType === 'Insurance' ? count + 1 : count;
    const OrderNumberCheck =
      order.externalReferenceNumber || order.orderNumber;
    const newOrder = {
      OrderNumberOrderDate: [order.orderDate, OrderNumberCheck],
      OrderNo: order.orderNumber,
      OrderNumber: order.externalReferenceNumber,
      OrderedDate: order.orderDate,
      OrderStatus: getStatusLabel(order.orderStatus, labels),
      OrderCharges: order.totalAmount?.toString() || '0.00',
      view: order.id,
      HeaderId: order.id,
      LimitedOrderTaxesTotal: '0.00',
      LimitedOrderChargesTotal: '0.00',
      LimitedOrderLinesTotal: '0.00',
      OnlineStoreOrderNumber: order.externalReferenceNumber,
      LimitedOrderTotal: order.totalAmount?.toString() || '0.00',
      orderType,
    };
    transformedOrders.push(newOrder);
  });
  // if count is greater than zero, an order of type insurance exists
  // and we want to show a disclaimer
  const hasInsurance = count > 0 ? true : false;
  return [transformedOrders, hasInsurance];
}
