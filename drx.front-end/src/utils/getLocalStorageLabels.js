export default function getLocalStorageLabels(locale = 'en') {
  // accepts a locale string, defaults to en if locale is undefined
  const list = localStorage.getItem(
    `i18next_drx-main_res_${locale}-translation`,
  );

  // if list returns null, try again with en
  const fallback =
    list ||
    localStorage.getItem(`i18next_drx-main_res_en-translation`);

  let ls = JSON.parse(fallback) || {};

  return ls;
}
