import _ from 'lodash';

export default function mapDetailsTimelines(
  timelines,
  orderStatus,
  labels,
) {
  const { type, totalAmount, status, trackingNumber, shippingUrl } =
    orderStatus;

  // based on order status determine if insurance, self pay or cancelled
  // also if insurance determine if total less than or greater than $4k

  function formatSuccess(message, trackingNumber, shippingUrl) {
    // success message expects a SC dictionary label that looks like this :
    // "Your order tracking number: {xxxxxxxxx}<br />\nTrack your order here.
    // <a href="/" target="_blank" rel="noopener noreferrer">Third party link</a>"

    const msg = labels[message];
    let result = msg
      .replace('{xxxxxxxxx}', trackingNumber)
      .replace('href="/"', `href="${shippingUrl}${trackingNumber}"`);

    return JSON.stringify(result);
  }

  let timelinesArray = [];

  if (
    status?.toUpperCase() === 'CANCELLED' &&
    type?.toUpperCase() !== 'CAM-REIMBURSEMENT-ORD'
  ) {
    timelinesArray = timelines
      ?.filter(timeline => timeline.flowName?.value === 'cancelled')
      .map(timeline => {
        return {
          name: timeline.flowName?.value,
          stages: timeline.phase.map(step => {
            return {
              id: step.phaseId?.value,
              label: step.label?.targetItem?.key?.value,
              notes: [
                {
                  id: '',
                  content:
                    step.phaseId?.value === 'shipped'
                      ? formatSuccess(
                          step.note?.targetItem?.key?.value,
                          trackingNumber,
                          shippingUrl,
                        )
                      : JSON.stringify(
                          labels[step.note?.targetItem?.key?.value] ||
                            '',
                        ),
                },
              ],
            };
          }),
        };
      });
  } else if (type?.toUpperCase() === 'CAM-SALE') {
    timelinesArray = timelines
      ?.filter(timeline => timeline.flowName?.value === 'sale')
      .map(timeline => {
        return {
          name: timeline.flowName?.value,
          stages: timeline.phase.map(step => {
            return {
              id: step.phaseId?.value,
              label: step.label?.targetItem?.key?.value,
              notes: [
                {
                  id: '',
                  content:
                    step.phaseId?.value === 'shipped'
                      ? formatSuccess(
                          step.note?.targetItem?.key?.value,
                          trackingNumber,
                          shippingUrl,
                        )
                      : JSON.stringify(
                          labels[step.note?.targetItem?.key?.value] ||
                            '',
                        ),
                },
              ],
            };
          }),
        };
      });
  } else {
    timelinesArray = timelines
      ?.filter(timeline => timeline.flowName?.value === 'insurance')
      .map(timeline => {
        let phase = timeline.phase;
        let updatedPhase = phase;
        if (totalAmount < 4000) {
          updatedPhase = _.reject(phase, function (item) {
            return item.phaseId?.value === 'preparingForShipment';
          });
        }

        return {
          name: timeline.flowName?.value,
          stages: updatedPhase.map(step => {
            return {
              id: step.phaseId?.value,
              label: step.label?.targetItem?.key?.value,
              notes: [
                {
                  id: '',
                  content:
                    step.phaseId?.value === 'shipped'
                      ? formatSuccess(
                          step.note?.targetItem?.key?.value,
                          trackingNumber,
                          shippingUrl,
                        )
                      : JSON.stringify(
                          labels[step.note?.targetItem?.key?.value] ||
                            '',
                        ),
                },
              ],
            };
          }),
        };
      });
  }
  return timelinesArray[0];
}
