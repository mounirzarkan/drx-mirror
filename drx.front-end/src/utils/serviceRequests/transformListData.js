import getStatusLabel from './getStatusLabel';
import getFallbackImage from '../getFallbackImage';
import resetToMidnight from '../resetToMidnight';

export const transformListData = (
  labels,
  fallbackImage,
  response,
) => {
  if (response.data?.data?.requestList.length === 0) return [];
  return response.data?.data?.requestList.map(item => {
    return {
      device: [
        item.name,
        {
          img: {
            src: `https://assets.cochlear.com/api/public/content/${item.partNumber}`,
            alt: item.name,
            fallback: getFallbackImage(
              item.type,
              fallbackImage[0].children,
            ),
          },
          text: {
            content: item.name,
            type: 'body-text',
          },
        },
      ],
      requestId: item.id,
      requestNo: item.serviceRequestNumber,
      createdOn: resetToMidnight(item.createdDate),
      status: getStatusLabel(item.status, labels),
      createdOnRequestNoCombined: [
        resetToMidnight(item.createdDate),
        item.serviceRequestNumber,
      ],
    };
  });
};
