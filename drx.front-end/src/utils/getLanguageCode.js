export default function getLanguageCode(lang) {
  const match = lang.match(/^[a-zA-Z]+/);
  const languageCode = match ? match[0] : '';

  // Return "en" if language code is empty or not exactly 2 characters
  return languageCode.length === 2 ? languageCode : 'en';
}

// Example usage
// console.log(getLanguageCode(""));         // Output: "en"
// console.log(getLanguageCode("ja"));       // Output: "ja"
// console.log(getLanguageCode("ja_JP"));    // Output: "ja"
// console.log(getLanguageCode("ja-JP"));    // Output: "ja"
// console.log(getLanguageCode("xyz"));      // Output: "en"
// console.log(getLanguageCode("f"));        // Output: "en"
