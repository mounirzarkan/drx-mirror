const {
  defaultLanguage,
  translationConfig
} = require('../common/data/translationConfig.js');
const {log} = require('../common/utils/index.js');

function translationMapping(countryCode, languageCode) {
  const translationKey = `${countryCode.toLowerCase()}-${languageCode.toLowerCase()}`;

  log.debug('translationMapping, countryCode');
  log.debug(countryCode);

  log.debug('translationMapping, languageCode');
  log.debug(languageCode);

  log.debug('translationMapping, translationKey');
  log.debug(translationKey);

  let language = defaultLanguage;

  if (translationConfig[translationKey]) {
    language = translationConfig[translationKey];
  }

  log.debug('translationMapping, sitecore language');
  log.debug(language);

  return language;
}

module.exports = {translationMapping};
