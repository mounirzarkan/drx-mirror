import { getHtmlAttributes } from '../_helpers/html';
import getFallbackImage from '../getFallbackImage';

function deviceImg(customerFacingName, productMeta) {
  if (customerFacingName && productMeta) {
    const match = productMeta.find(
      ({ name }) =>
        name.toLowerCase() === customerFacingName.toLowerCase(),
    );
    return match?.friendlyImage?.value || '';
  }
  return '';
}

function deviceTitle(type, name, description, model) {
  if (type === 'Remote Assistant') return model;
  if (type === 'Accessory') return description;
  return name;
}

// returns true if device is out of warranty
function expiredWarranty(timestampStr) {
  if (!timestampStr) return true;
  const timestamp = Number.parseInt(timestampStr, 10);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate());

  return new Date(timestamp) < currentDate;
}

function resetToMidnight(d) {
  const dateFormat = new Date(d);
  dateFormat.setMinutes(
    dateFormat.getMinutes() + dateFormat.getTimezoneOffset(),
  );
  return dateFormat.getTime();
}

export const transformDetailData = (
  warrantyData,
  fallbackImage,
  serviceRequest,
  detailsSections,
  isPatientPersona,
  productMeta,
  response,
) => {
  const { data } = response;
  const warrantyObj = detailsSections.find(
    x => x.name.toLowerCase() === 'warranty',
  );
  const repairObj = detailsSections.find(
    x => x.name.toLowerCase() === 'repair',
  );
  const buttonObj =
    serviceRequest.boolValue &&
    getHtmlAttributes(repairObj.button.value, 'link', [
      'url',
      'text',
    ]);
  const warrantySection = {
    displayId: warrantyObj.name.toLowerCase(),
    sectionTitle: warrantyObj.title.value,
    sectionText: data?.warrantyDescription || '',
  };
  const repairSection = serviceRequest.boolValue && {
    displayId: repairObj.name.toLowerCase(),
    sectionTitle: repairObj.title.value,
    sectionText: repairObj.body.value,
    button: {
      text: buttonObj.text,
      href: buttonObj.url,
    },
  };

  // pass warranty date to expiredWarranty fn to determine if device is still in warranty
  const hasExpiredWarranty = expiredWarranty(
    data?.latestWarrantyDate,
  );
  return {
    warrantyOptions: warrantyData?.warrantyOptions,
    classDeviceType: data?.classDeviceType,
    deviceName:
      deviceTitle(
        data?.classDeviceType,
        data?.customerFacingName,
        data?.productDescription,
        data?.modelNumber,
      ) || '',
    deviceDescription: data?.productDescription,
    deviceImage: {
      src: deviceImg(data?.customerFacingName, productMeta),
      alt:
        deviceTitle(
          data?.classDeviceType,
          data?.customerFacingName,
          data?.productDescription,
          data?.modelNumber,
        ) || '',
      width: '150px',
      height: '150px',
      fallback: getFallbackImage(
        data?.deviceType,
        fallbackImage[0].children,
      ),
    },
    deviceColor: data?.colour,
    deviceSerialNumber: data?.serialNumber,
    deviceSide:
      data?.earSide === 'Left' || data?.earSide === 'Right'
        ? data?.earSide
        : undefined,
    deviceActivationDate:
      data?.classDeviceType !== 'Remote Assistant'
        ? resetToMidnight(data?.fittingDate)
        : resetToMidnight(data?.purchaseDate) || undefined,
    deviceExpirationDate:
      resetToMidnight(data?.latestWarrantyDate) || undefined,
    deviceSurgeryDate:
      data?.classDeviceType === 'Implant'
        ? resetToMidnight(data?.purchaseDate)
        : undefined,
    sections: [
      ...(data?.classDeviceType !== 'Implant'
        ? [warrantySection]
        : []),
      ...(serviceRequest.boolValue &&
      data?.classDeviceType === 'Sound Processor' &&
      data?.hasOpenSR === false &&
      data?.isSupported === true &&
      hasExpiredWarranty === false &&
      isPatientPersona === true
        ? [repairSection]
        : []),
    ],
    modelNumber: data?.modelNumber,
  };
};
