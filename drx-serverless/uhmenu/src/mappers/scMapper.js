const {translationConfig} = require('../data/translationConfig.js');

const log = require('../util/logUtil.js');
const {getDefaultLocale} = require('../util/utils.js');

const translationMapping = function (
  countryCode,
  languageCode,
  englishSpeakingCountries
) {
  const translationKey = `${countryCode.toLowerCase()}-${languageCode.toLowerCase()}`;

  log.debug('translationMapping, countryCode');
  log.debug(countryCode);

  log.debug('translationMapping, languageCode');
  log.debug(languageCode);

  log.debug('translationMapping, translationKey');
  log.debug(translationKey);

  let language = getDefaultLocale(
    countryCode,
    languageCode,
    englishSpeakingCountries
  );

  if (translationConfig[translationKey]) {
    language = translationConfig[translationKey];
  }

  log.debug('translationMapping, sitecore language');
  log.debug(language);

  return language;
};

module.exports = {translationMapping};
