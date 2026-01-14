// given a salesforce order status and an object of lables in the requried language
// return the required label to display
export default function getStatusLabel(status, labels) {
  let label = '';
  switch (status) {
    case 'Open': {
      label = ['01', labels['labels.serviceRequests.status.open']];
      break;
    }
    case 'Closed':
    case 'Cancelled by User': {
      label = ['02', labels['labels.serviceRequests.status.closed']];
      break;
    }
    default: {
      label = ['01', labels['labels.serviceRequests.status.open']];
    }
  }
  return label;
}
