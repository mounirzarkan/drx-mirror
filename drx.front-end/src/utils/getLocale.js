// composes local to be used for the Intl js library
export default function getLocale(country, language) {
  return `${language.toLowerCase()}-${country.toUpperCase()}`;
}
