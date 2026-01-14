import countryList from './countryList';

function countryCodeToName(countryCode) {
  const countryObj = countryList.find(
    ({ code }) => code?.toUpperCase() === countryCode?.toUpperCase(),
  ) || { name: countryCode || '' };
  return countryObj.name;
}

export { countryCodeToName };
