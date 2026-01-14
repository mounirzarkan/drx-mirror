// get country code from user token and replaces it with cochlear api match
// for that specific country if it doesnt exist
export default function getCountryAPI(c) {
  const countryCode = c.toLowerCase();
  let code = '';
  switch (countryCode) {
    case 'pr':
      code = 'us';
      break;
    default:
      code = countryCode;
  }
  return code;
}
