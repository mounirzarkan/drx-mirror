import convertDate from '../../../utils/convertDate';

export default function convertReadData(
  data,
  config = { country: 'us', language: 'en', mask: 'mmmm dd yyyy' },
) {
  const clonedData = { ...data };

  if (clonedData.dateOfBirth?.value) {
    // convert value to a string, for example: date of birth number to date string (1958-09-16 -> 'Sep 16, 1958')
    clonedData.dateOfBirth = {
      ...clonedData.dateOfBirth,
      value: convertDate(clonedData.dateOfBirth.value, {
        // JWT data
        ...config,
      }),
    };
  }
  return clonedData;
}
