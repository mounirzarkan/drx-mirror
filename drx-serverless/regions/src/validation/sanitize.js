const genericJsonSanitizer = require('generic-json-sanitizer');
function clean(input) {
  genericJsonSanitizer.sanitizeJsonSync(input, {
    allowedAttributes: {},
    allowedTags: []
  });
}

function limitMaxLength(input, maxLength, rtnOriginal) {
  const inputStr = input + '';
  if (inputStr.length > maxLength) {
    throw new Error(` Property exceeds character limit inputStr: ${inputStr}`);
  }
  return rtnOriginal ? input : inputStr;
}

module.exports = {clean, limitMaxLength};
