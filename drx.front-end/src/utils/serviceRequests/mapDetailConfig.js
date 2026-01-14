import lodash from 'lodash';

function adjacentHeaderIds(currentId, list) {
  const index = list.findIndex(
    item => item.toString() === currentId.toString(),
  );
  let prev;
  let next;
  if (list && list.length > 1 && index >= 0) {
    if (index - 1 >= 0) {
      prev = list[index - 1];
    } else {
      prev = list[list.length - 1];
    }
    if (index + 1 < list.length) {
      next = list[index + 1];
    } else {
      next = list[0];
    }
  }
  return { prev, next };
}

function mapLinks(
  labels,
  toolbarLinks,
  routerLink,
  location,
  sid,
  userId,
  sortedList,
  requestId,
) {
  const links = [];
  const linkDefaults = {
    align: 'right',
    disabled: false,
    linkTo: '/',
    onHandle: () => {},
    routerLink,
  };

  if (requestId && sortedList.length > 1) {
    // only show prev and next if there is more than one result

    const { prev, next } = adjacentHeaderIds(requestId, sortedList);

    toolbarLinks.map(l => {
      if (!lodash.isEmpty(l)) {
        return links.push({
          ...linkDefaults,
          align: l.buttonAlign.value,
          icon: l.icon.value,
          iconAlign: l.iconAlign.value,
          text: labels[l.text.targetItem.key.value],
          type: l.icon.value,
          linkTo: `${
            location.pathname
          }?account=${sid}&user=${userId}&id=${
            l.name.toLowerCase() === 'prev' ? prev : next
          }&page=0`,
        });
      }
    });
  }

  return links;
}

// the left handside toolbar links / breadcrumbs
function mapToolbar(labels, handleDataQuery, requestId) {
  return [
    {
      align: 'left',
      icon: '',
      sections: [
        {
          action: () => {
            handleDataQuery(null, 'actions.details.navigateBack', {});
          },
          text: labels[
            'labels.serviceRequests.details.toolbar.serviceRequests'
          ],
        },
        {
          action: function noRefCheck() {},
          text: requestId
            ? `${labels['labels.serviceRequests.details.toolbar.requestNo']}: ${requestId}`
            : '',
        },
      ],
      type: 'breadcrumb',
    },
  ];
}

export const mapDetailConfig = (
  labels,
  handleDataQuery,
  detailData,
  toolbarLinks = [], // empty array by default
  requestLabels,
  deviceLabels,
  shippingLabels,
  detailsConfig,
  routerLink,
  location,
  sid,
  userId,
  sortedList,
) => {
  const controlLinks = mapLinks(
    labels,
    toolbarLinks,
    routerLink,
    location,
    sid,
    userId,
    sortedList,
    detailData?.request?.requestId,
  );
  const breadcrumbs = mapToolbar(
    labels,
    handleDataQuery,
    detailData?.request?.id,
    // previous and next
  );
  return {
    toolbar: {
      items: [...breadcrumbs, ...controlLinks],
    },
    sections: {
      request: {
        labels: {
          title: requestLabels?.requestTitle?.targetItem?.key?.value,
          id: requestLabels?.requestId?.targetItem?.key?.value,
          status:
            requestLabels?.requestStatus?.targetItem?.key?.value,
          createdOn:
            requestLabels?.requestCreatedOn?.targetItem?.key?.value,
          clinic:
            requestLabels?.requestClinic?.targetItem?.key?.value,
          problem:
            requestLabels?.requestProblem?.targetItem?.key?.value,
        },
      },
      device: {
        labels: {
          title: deviceLabels?.deviceTitle?.targetItem?.key?.value,
          warranty:
            deviceLabels?.deviceWarranty?.targetItem?.key?.value,
          partNumber:
            deviceLabels?.devicePartNo?.targetItem?.key?.value,
          activated:
            deviceLabels?.deviceActivated?.targetItem?.key?.value,
          type: {
            processor:
              deviceLabels?.deviceTypeProcessor?.targetItem?.key
                ?.value,
            accessory:
              deviceLabels?.deviceTypeAccessory?.targetItem?.key
                ?.value,
          },
          hasWarranty: {
            true: deviceLabels?.deviceWarrantyTrue?.targetItem?.key
              ?.value,
            false:
              deviceLabels?.deviceWarrantyFalse?.targetItem?.key
                ?.value,
          },
        },
      },
      shipping: {
        addressFormat: detailsConfig?.addressFormat?.value,
        labels: {
          title:
            shippingLabels?.shippingTitle?.targetItem?.key?.value,
          clinicDescription:
            shippingLabels?.shippingClinicDescription?.targetItem?.key
              ?.value,
          patientDescription:
            shippingLabels?.shippingPatientDescription?.targetItem
              ?.key?.value,
        },
      },
    },
  };
};
