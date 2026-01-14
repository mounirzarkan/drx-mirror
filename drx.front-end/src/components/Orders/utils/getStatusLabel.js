// given a salesforce order status and an object of lables in the requried language
// return the required label to display
export default function getStatusLabel(status, labels) {
  let label = '';
  switch (status) {
    case 'Entered':
    case 'Booked': {
      label = ['01', labels['labels.orders.states.inProgress']];
      break;
    }
    case 'Cancelled': {
      label = ['02', labels['labels.orders.states.cancelled']];
      break;
    }
    case 'Order Shipped':
    case 'Shipped':
    case 'Closed':
    case 'Completed':
    case 'Closed/Completed': {
      label = ['03', labels['labels.orders.states.shipped']];
      break;
    }
    default: {
      label = ['01', labels['labels.orders.states.inProgress']];
    }
  }
  return label;
}
