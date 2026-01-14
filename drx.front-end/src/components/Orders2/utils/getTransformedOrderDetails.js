import _ from 'lodash';

import convertDate from '../../../utils/convertDate';
import getStatusLabel from './getStatusLabel';

function orderStatus(orderStatus) {
  const orderStatusCamelCase = _.camelCase(orderStatus);
  let label = '';
  switch (orderStatusCamelCase) {
    case 'entered':
    case 'booked': {
      label = 'inProgress';
      break;
    }
    case 'created':
    case 'orderCreation': {
      label = 'orderCreated';
      break;
    }
    case 'documentCollection': {
      label = 'gatheringDocumentation';
      break;
    }
    case 'orderShipped':
    case 'shipped':
    case 'closed':
    case 'completed':
    case 'closedCompleted': {
      label = 'shipped';
      break;
    }

    default: {
      label = orderStatusCamelCase;
    }
  }
  return label;
}

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

export function getTransformedOrderStatus(data, dateFormat) {
  let transformedOrderStatusString = orderStatus(data.orderStatus);

  const transformedOrderStatus = {
    // cam sale or insurance
    type: data.orderType,
    status: data.orderStatus,
    shippingUrl: data.shippingUrl,
    trackingNumber: data.trackingNumber,
    totalTax: data.totalTax,
    totalItemsAmount: data.totalItemsAmount,
    totalShipping: data.totalShipping,
    totalAmount: data.totalAmount,
    date: {
      // converted as it is used in the header as plain text
      formatted: {
        orderCreated: convertDate(data.orderCreationDate, {
          mask: dateFormat,
        }),
      },
      orderCreated: data.orderCreationDate,
      inProgress: data.orderCreationDate,
      shipped: data.shippedDate,
      gatheringDocumentation: data.gatheringDocStartedDate,
      insuranceAuthorization: data.insuranceAuthorisationStartedDate,
      preparingForShipment: data.prepareShippingStartedDate,
      cancelled:
        transformedOrderStatusString === 'cancelled'
          ? data.lastUpdateDate
          : null, // only used if status is cancelled
    },
    stage: {
      main: transformedOrderStatusString,
    },
  };

  return transformedOrderStatus;
}
