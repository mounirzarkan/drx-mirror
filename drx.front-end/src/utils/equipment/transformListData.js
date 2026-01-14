import getFallbackImage from '../getFallbackImage';

function getAbbrLabel(earSide) {
  return earSide === 'Left'
    ? 'labels.equipement.modelData.l-abbrLabel'
    : 'labels.equipement.modelData.r-abbrLabel';
}

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

function detailDataSection(warrantyData, item) {
  if (item?.type === 'implant') {
    return [
      {
        type: 'title',
        text:
          deviceTitle(
            item?.classDeviceType,
            item?.customerFacingName,
            item?.productDescription,
            item?.modelNumber,
          ) || '',
      },
      {
        type: 'side-pair',
        keyLabel: 'labels.equipement.modelData.side',
        abbrLabel: getAbbrLabel(item?.earSide),
        value: item?.earSide,
        side: item?.earSide?.toLowerCase(),
      },
      {
        type: 'text-pair',
        keyLabel: 'labels.equipement.modelData.serialNo',
        value: item.serialNumber || '',
      },
    ];
  }

  return [
    {
      type: 'title',
      text:
        deviceTitle(
          item?.classDeviceType,
          item?.customerFacingName,
          item?.productDescription,
          item?.modelNumber,
        ) || '',
    },
    {
      type: 'text-pair',
      keyLabel: 'labels.equipement.modelData.serialNo',
      value: item.serialNumber || '',
    },
    {
      type: 'warranty-pair',
      keyLabel: 'labels.equipement.modelData.warranty',
      value: {
        ...warrantyData,
        timestamp: item.latestWarrantyDate,
      },
    },
  ];
}

export const transformListData = (
  warrantyData,
  fallbackImage,
  productMeta,
  response,
) => {
  if (response.data.length === 0) return [];

  return response.data.map(item => {
    return {
      modelDetailData: {
        img: {
          src: deviceImg(item.customerFacingName, productMeta),
          alt: deviceTitle(
            item.classDeviceType,
            item.customerFacingName,
            item.productDescription,
            item.modelNumber,
          ),
          fallback: getFallbackImage(
            item.type,
            fallbackImage[0].children,
          ),
        },
        // title text-pair side-pair warranty-pair
        sections: detailDataSection(warrantyData, item),
        type: item.type,
      },
      modelData: {
        img: {
          src: deviceImg(item.customerFacingName, productMeta),
          alt: deviceTitle(
            item.classDeviceType,
            item.customerFacingName,
            item.productDescription,
            item.modelNumber,
          ),
          fallback: getFallbackImage(
            item.type,
            fallbackImage[0].children,
          ),
        },
        productName: deviceTitle(
          item.classDeviceType,
          item.customerFacingName,
          item.productDescription,
          item.modelNumber,
        ),
        earSide:
          item?.type === 'implant' &&
          (item?.earSide === 'Left' || item?.earSide === 'Right')
            ? {
                side: item?.earSide?.toLowerCase(),
                abbrLabel: getAbbrLabel(item?.earSide),
                text: item?.earSide,
              }
            : undefined,
        type: item.type,
      },
      warrantyData: {
        ...warrantyData,
        timestamp: item.latestWarrantyDate,
      },
      serialNumber: item.serialNumber,
      latestWarrantyDate: item.latestWarrantyDate,
      colour: item.colour,
      purchaseDate: item.purchaseDate,
      type: item.type,
      id: item.id,
    };
  });
};
