import getFallbackImage from '../getFallbackImage';
import resetToMidnight from '../resetToMidnight';

export const transformDetailData = (
  fallbackImage,
  detailsContent,
  userList,
  response,
) => {
  const { data } = response;

  let shippingName;
  if (data?.data?.shippingDetails?.shippedTo?.provider) {
    shippingName = data?.data?.requestDetails?.clinic;
  } else {
    const shippingId =
      data?.data?.shippingDetails?.shippedTo?.patient?.cochlearId;
    const result = userList.find(
      ({ userId }) => userId === shippingId,
    );
    shippingName = result
      ? `${result.firstName} ${result.lastName}`
      : `${userList[0].firstName} ${userList[0].lastName}`; // fallback to signed in user
  }

  return {
    request: {
      id: data?.data?.requestDetails?.serviceRequestNumber,
      requestId: data?.data?.requestDetails?.id,
      status: data?.data?.requestDetails?.status,
      createdOn: resetToMidnight(
        data?.data?.requestDetails?.createdDate,
      ),
      clinic: data?.data?.requestDetails?.clinic,
      problem: [
        `${data?.data?.requestDetails?.problem?.code} - ${data?.data?.requestDetails?.problem?.description}`,
        data?.data?.requestDetails?.problem?.details,
      ],
    },
    device: {
      deviceImage: {
        src: `https://assets.cochlear.com/api/public/content/${data?.data?.requestDetails?.partNumber}`,
        alt: data?.data?.requestDetails?.name,
        width: '150px',
        height: '150px',
        fallback: getFallbackImage(
          data?.data?.requestDetails?.type,
          fallbackImage[0].children,
        ),
      },
      type: data?.data?.requestDetails?.type,
      description: data?.data?.requestDetails?.name,
      warranty: data?.data?.requestDetails?.warranty,
      partNumber: data?.data?.requestDetails?.partNumber,
      activated: data?.data?.requestDetails?.activated,
    },
    shipping: {
      shippedTo: data?.data?.shippingDetails?.shippedTo?.provider
        ? 'provider'
        : 'patient', // "provider" || "patient"
      name: shippingName,
      shippingAddress: {
        street: data?.data?.shippingDetails?.address?.street,
        city: data?.data?.shippingDetails?.address?.city,
        state: data?.data?.shippingDetails?.address?.state,
        postalCode: data?.data?.shippingDetails?.address?.postalCode,
        countryCode:
          data?.data?.shippingDetails?.address?.countryCode,
      },
    },
  };
};
