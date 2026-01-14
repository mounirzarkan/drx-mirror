// import { parse } from 'node-html-parser';

export function convertGeoFormatToRegex(geoFormat) {
  let regexArr = [];
  // split values
  let geoFormats = geoFormat[0].split('|');
  let outputStr;
  geoFormats.forEach(format => {
    switch (format) {
      case '#####-####':
        outputStr = '(\\d{5}(-)?(\\d{4})?)';
        break;

      case '####':
        outputStr = '\\d{4}';
        break;

      // IT
      case '#####':
        outputStr = '\\d{5}';
        break;

      // JP
      case '###-####':
        outputStr = '(\\d{3}(-)?(\\d{4})?)';
        break;

      case '@#@ #@#':
        outputStr = '[A-Z]{1}\\d{1}[A-Z]{1} \\d{1}[A-Z]{1}\\d{1}';
        break;

      case '@@@ @@@@':
        outputStr = '[A-Z]{3} [A-Z]{4}';
        break;

      case '@# #@@':
        outputStr = '[A-Z]{1}\\d{1} \\d{1}[A-Z]{2}';
        break;

      case '@## #@@':
        outputStr = '[A-Z]{1}\\d{2} \\d{1}[A-Z]{2}';
        break;

      case '@@# #@@':
        outputStr = '[A-Z]{2}\\d{1} \\d{1}[A-Z]{2}';
        break;

      case '@@## #@@':
        outputStr = '[A-Z]{2}\\d{2} \\d{1}[A-Z]{2}';
        break;

      case '@#@ #@@':
        outputStr = '[A-Z]{1}\\d{1}[A-Z]{1} \\d{1}[A-Z]{2}';
        break;

      case '@@#@ #@@':
        outputStr = '[A-Z]{2}\\d{1}[A-Z]{1} \\d{1}[A-Z]{2}';
        break;

      default:
        outputStr = format;
    }
    regexArr.push(`^${outputStr}$`);
  });

  return regexArr;
}
