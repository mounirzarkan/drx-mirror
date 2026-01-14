const defaultLanguage = 'en';

const translationConfig = {
  'us-de': 'de-DE',
  'it-it': 'it-IT',
  'fr-fr': 'fr-FR',
  'jp-jp': 'ja-JP',
  'jp-ja': 'ja-JP',
  'kr-kr': 'ko-KR',
  'kr-ko': 'ko-KR',
  'de-de': 'de-DE',
  'be-fr': 'fr-BE',
  'be-nl': 'nl-BE',
  'cz-cs': 'cs-CZ',
  'pr-en': 'en',
  'pr-pr': 'en'
};

function getDefaultLocale(country, lng, englishSpeakingCountries) {
  console.log('getDefaultLocale: ', country, englishSpeakingCountries);
  let language = 'en';

  if (englishSpeakingCountries.includes(country.toUpperCase())) {
    language = 'en';
  } else {
    switch (country.toUpperCase()) {
      case 'IT':
        language = 'it-IT';
        break;
      default:
        return (language = lng.toLowerCase() + '-' + country.toUpperCase());
    }
  }
  return language;
}

module.exports = {
  defaultLanguage,
  translationConfig,
  getDefaultLocale
};
