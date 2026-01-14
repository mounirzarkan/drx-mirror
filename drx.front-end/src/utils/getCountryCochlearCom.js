// get country code from user token and replaces it with cochlear.com website
// match for that specific country if it doesnt exist, eg NZ -> AU, PR -> US, etc
export default function getCountryCochlearCom(c) {
  const map = {
    pr: 'us',
    nz: 'au',
    gb: 'uk',
    ie: 'uk',
  };

  // Return the mapped value if it exists, otherwise return the original value
  return map[c.toLowerCase()] || c.toLowerCase();
}
