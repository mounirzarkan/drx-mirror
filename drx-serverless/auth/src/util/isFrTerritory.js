const FR_TERRITORIES = [
  'GF',
  'PF',
  'GP',
  'MQ',
  'MU',
  'YT',
  'MC',
  'NC',
  'PM',
  'BL',
  'MF',
  'WF'
];

// Check if user's countryCode is a French Territory
function isFrTerritory(countryCode) {
  return FR_TERRITORIES.includes(countryCode);
}

module.exports = isFrTerritory;
