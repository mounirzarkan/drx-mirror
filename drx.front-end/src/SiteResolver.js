const sitesMap = new Map();

//#region CZ
//-----------------
sitesMap.set('cz/en', {
  siteName: 'drx-cz-en',
  lang: 'en',
  dictionary: 'en',
  country: 'cz',
});

sitesMap.set('cz/cs', {
  siteName: 'drx-cz-cs',
  lang: 'cs-CZ',
  dictionary: 'cs-CZ',
  country: 'cz',
});
//#endregion

//#region GB
//-----------------
sitesMap.set('gb/en', {
  siteName: 'drx-gb-en',
  lang: 'en',
  dictionary: 'en-GB',
  country: 'gb',
});
//#endregion

//#region IE
//-----------------

sitesMap.set('ie/en', {
  siteName: 'drx-ie-en',
  lang: 'en',
  dictionary: 'en-IE',
  country: 'ie',
});
//#endregion

//#region AU
//-----------------

sitesMap.set('au/en', {
  siteName: 'drx-au-en',
  lang: 'en',
  dictionary: 'en-AU',
  country: 'au',
});
//#endregion

//#region NZ
//-----------------

sitesMap.set('nz/en', {
  siteName: 'drx-nz-en',
  lang: 'en',
  dictionary: 'en-NZ',
  country: 'nz',
});
//#endregion

//#region CA
//-----------------

sitesMap.set('ca/en', {
  siteName: 'drx-ca-en',
  lang: 'en',
  dictionary: 'en-CA',
  country: 'ca',
});
//#endregion

//#region US
//-----------------

sitesMap.set('us/en', {
  siteName: 'drx-us-en',
  lang: 'en',
  dictionary: 'en',
  country: 'us',
});
//#endregion

//#region italian
//-----------------

sitesMap.set('it/en', {
  siteName: 'drx-it-en',
  lang: 'en',
  dictionary: 'en',
  country: 'it',
});

sitesMap.set('it/it', {
  siteName: 'drx-it-it',
  lang: 'it-IT',
  dictionary: 'it-IT',
  country: 'it',
});

//#endregion

//#region korea
//-----------------

sitesMap.set('kr/en', {
  siteName: 'drx-kr-en',
  lang: 'en',
  dictionary: 'en',
  country: 'kr',
});

sitesMap.set('kr/ko', {
  siteName: 'drx-kr-ko',
  lang: 'ko-KR',
  dictionary: 'ko-KR',
  country: 'kr',
});

//#endregion

//#region japan
//-----------------

sitesMap.set('jp/en', {
  siteName: 'drx-jp-en',
  lang: 'en',
  dictionary: 'en',
  country: 'jp',
});

sitesMap.set('jp/ja', {
  siteName: 'drx-jp-ja',
  lang: 'ja-JP',
  dictionary: 'ja-JP',
  country: 'jp',
});

//#endregion

//#region france
//-----------------

sitesMap.set('fr/en', {
  siteName: 'drx-fr-en',
  lang: 'en',
  dictionary: 'en',
  country: 'fr',
});

sitesMap.set('fr/fr', {
  siteName: 'drx-fr-fr',
  lang: 'fr-FR',
  dictionary: 'fr-FR',
  country: 'fr',
});

//#endregion

//#region belgium
//-----------------

sitesMap.set('be/en', {
  siteName: 'drx-be-en',
  lang: 'en',
  dictionary: 'en',
  country: 'be',
});

sitesMap.set('be/fr', {
  siteName: 'drx-be-fr',
  lang: 'fr-BE',
  dictionary: 'fr-BE',
  country: 'be',
});

sitesMap.set('be/nl', {
  siteName: 'drx-be-nl',
  lang: 'nl-BE',
  dictionary: 'nl-BE',
  country: 'be',
});

//#endregion

//#region netherlands
//--------------------

sitesMap.set('nl/en', {
  siteName: 'drx-nl-en',
  lang: 'en',
  dictionary: 'en',
  country: 'nl',
});

sitesMap.set('nl/nl', {
  siteName: 'drx-nl-nl',
  lang: 'nl-NL',
  dictionary: 'nl-NL',
  country: 'nl',
});

//#endregion

//#region germany
//--------------------

sitesMap.set('de/en', {
  siteName: 'drx-de-en',
  lang: 'en',
  dictionary: 'en',
  country: 'de',
});

sitesMap.set('de/de', {
  siteName: 'drx-de-de',
  lang: 'de-DE',
  dictionary: 'de-DE',
  country: 'de',
});

//#endregion

// removed from list
// sitesMap.set('at/en', { siteName: 'drx-at-en', lang: 'en', country: 'at' });
// sitesMap.set('at/de', { siteName: 'drx-at-de', lang: 'at-DE', country: 'at' });
// sitesMap.set('au/de', { siteName: 'drx-au-de', lang: 'de-DE', country: 'au' });
// sitesMap.set('be/en', { siteName: 'drx-be-en', lang: 'en', country: 'be' });
// sitesMap.set('be/fr', { siteName: 'drx-be-fr', lang: 'fr-BE', country: 'be' });
// sitesMap.set('be/nl', { siteName: 'drx-be-nl', lang: 'nl-BE', country: 'be' });
// sitesMap.set('br/en', { siteName: 'drx-br-en', lang: 'en', country: 'br' });
// sitesMap.set('br/pt', { siteName: 'drx-br-pt', lang: 'pt-BR', country: 'br' });
// sitesMap.set('ca/fr', { siteName: 'drx-ca-fr', lang: 'fr-CA', country: 'ca' });
// sitesMap.set('ch/en', { siteName: 'drx-ch-de-en', lang: 'en', country: 'ch' });
// sitesMap.set('ch/de', { siteName: 'drx-ch-de-de', lang: 'de-CH', country: 'ch' });
// sitesMap.set('ch/ef', { siteName: 'drx-ch-fr-en', lang: 'en', country: 'ch' });
// sitesMap.set('ch/fr', { siteName: 'drx-ch-fr-fr', lang: 'fr-CH', country: 'ch' });
// sitesMap.set('cz/en', { siteName: 'drx-cz-en', lang: 'en', country: 'cz' });
// sitesMap.set('cz/cs', { siteName: 'drx-cz-cs', lang: 'cs-CZ', country: 'cz' });
// sitesMap.set('de/en', { siteName: 'drx-de-en', lang: 'en', country: 'de' });
// sitesMap.set('de/de', { siteName: 'drx-de-de', lang: 'de-DE', country: 'de' });
// sitesMap.set('dk/en', { siteName: 'drx-dk-en', lang: 'en', country: 'dk' });
// sitesMap.set('dk/da', { siteName: 'drx-dk-da', lang: 'da-DK', country: 'dk' });
// sitesMap.set('es/en', { siteName: 'drx-es-en', lang: 'en', country: 'es' });
// sitesMap.set('es/es', { siteName: 'drx-es-es', lang: 'es-ES', country: 'es' });
// sitesMap.set('fi/en', { siteName: 'drx-fi-en', lang: 'en', country: 'fi' });
// sitesMap.set('fi/fi', { siteName: 'drx-fi-fi', lang: 'fi-FI', country: 'fi' });
// sitesMap.set('fr/en', { siteName: 'drx-fr-en', lang: 'en', country: 'fr' });
// sitesMap.set('fr/fr', { siteName: 'drx-fr-fr', lang: 'fr-FR', country: 'fr' });
// sitesMap.set('hk/en', { siteName: 'drx-hk-en', lang: 'en', country: 'hk' });
// sitesMap.set('hk/zh', { siteName: 'drx-hk-zh', lang: 'zh-HK', country: 'hk' });
// sitesMap.set('hu/en', { siteName: 'drx-hu-en', lang: 'en', country: 'hu' });
// sitesMap.set('hu/hu', { siteName: 'drx-hu-hu', lang: 'hu-HU', country: 'hu' });
// sitesMap.set('id/en', { siteName: 'drx-id-en', lang: 'en', country: 'id' });
// sitesMap.set('id/id', { siteName: 'drx-id-id', lang: 'id-ID', country: 'id' });
// sitesMap.set('il/en', { siteName: 'drx-il-en', lang: 'en', country: 'il' });
// sitesMap.set('il/he', { siteName: 'drx-il-he', lang: 'he-IL', country: 'il' });
// sitesMap.set('in/en', { siteName: 'drx-in-en', lang: 'en', country: 'in' });
// sitesMap.set('it/en', { siteName: 'drx-it-en', lang: 'en', country: 'it' });
// sitesMap.set('it/it', { siteName: 'drx-it-it', lang: 'it-IT', country: 'it' });
// sitesMap.set('jp/en', { siteName: 'drx-jp-en', lang: 'en', country: 'jp' });
// sitesMap.set('jp/ja', { siteName: 'drx-jp-ja', lang: 'ja-JP', country: 'jp' });
// sitesMap.set('kr/en', { siteName: 'drx-kr-en', lang: 'en', country: 'kr' });
// sitesMap.set('kr/ko', { siteName: 'drx-kr-ko', lang: 'ko-KR', country: 'kr' });
// sitesMap.set('lk/en', { siteName: 'drx-lk-en', lang: 'en', country: 'lk' });
// sitesMap.set('la/en', { siteName: 'drx-la-en', lang: 'en', country: 'la' });
// sitesMap.set('la/es', { siteName: 'drx-la-es', lang: 'es-AR', country: 'la' });
// sitesMap.set('me/en', { siteName: 'drx-me-en', lang: 'en', country: 'me' });
// sitesMap.set('me/ar', { siteName: 'drx-me-ar', lang: 'ar-AE', country: 'me' });
// sitesMap.set('my/en', { siteName: 'drx-my-en', lang: 'en', country: 'my' });
// sitesMap.set('nl/en', { siteName: 'drx-nl-en', lang: 'en', country: 'nl' });
// sitesMap.set('nl/nl', { siteName: 'drx-nl-nl', lang: 'nl-NL', country: 'nl' });
// sitesMap.set('no/en', { siteName: 'drx-no-en', lang: 'en', country: 'no' });
// sitesMap.set('no/no', { siteName: 'drx-no-nb', lang: 'nb-NO', country: 'no' });
// sitesMap.set('pk/en', { siteName: 'drx-pk-en', lang: 'en', country: 'pk' });
// sitesMap.set('ph/en', { siteName: 'drx-ph-en', lang: 'en', country: 'ph' });
// sitesMap.set('ro/en', { siteName: 'drx-ro-en', lang: 'en', country: 'ro' });
// sitesMap.set('ro/ro', { siteName: 'drx-ro-ro', lang: 'ro-RO', country: 'ro' });
// sitesMap.set('ru/en', { siteName: 'drx-ru-en', lang: 'en', country: 'ru' });
// sitesMap.set('ru/ru', { siteName: 'drx-ru-ru', lang: 'ru-RU', country: 'ru' });
// sitesMap.set('sg/en', { siteName: 'drx-sg-en', lang: 'en', country: 'sg' });
// sitesMap.set('sv/en', { siteName: 'drx-sv-en', lang: 'en', country: 'sv' });
// sitesMap.set('sv/se', { siteName: 'drx-sv-se', lang: 'sv-SE', country: 'sv' });
// sitesMap.set('th/en', { siteName: 'drx-th-en', lang: 'en', country: 'th' });
// sitesMap.set('th/th', { siteName: 'drx-th-th', lang: 'th-TH', country: 'th' });
// sitesMap.set('tr/en', { siteName: 'drx-tr-en', lang: 'en', country: 'tr' });
// sitesMap.set('tr/tr', { siteName: 'drx-tr-tr', lang: 'tr-TR', country: 'tr' });
// sitesMap.set('tw/en', { siteName: 'drx-tw-en', lang: 'en', country: 'tw' });
// sitesMap.set('tw/zh', { siteName: 'drx-tw-zh', lang: 'zh-TW', country: 'tw' });
// sitesMap.set('us/es', { siteName: 'drx-us-es', lang: 'es-MX', country: 'us' });
// sitesMap.set('vn/en', { siteName: 'drx-vn-en', lang: 'en', country: 'vn' });
// sitesMap.set('vn/vi', { siteName: 'drx-vn-vi', lang: 'vi-VN', country: 'vn' });

// // non standard
// sitesMap.set('emea/en', {siteName: 'drx-emea-en', lang: 'en', country: 'emea'});
// sitesMap.set('mdr/en', {siteName: 'drx-mdr-en', lang: 'en', country: 'mdr'});
// sitesMap.set('apac/en', {siteName: 'drx-apac-en', lang: 'en', country: 'apac'});
// sitesMap.set('global/en', {siteName: 'drx-global-en', lang: 'en', country: 'global'});

// //brand-hub
// sitesMap.set('brand-hub', {siteName: 'brand-hub', lang: 'en', country: 'brand-hub'});

export default function resolveSite(reqUrl) {
  /**
   * Strip virtual path removes the virtual path component before a layoutService request is made, but
   * after the country, site and lang parameters are extracted from the virtual path.
   * @param {string} fPath full path from incoming request
   * @param {string} vPath virtual path component
   * @param {string} sitesObject virtual path site mappings
   * @returns {siteName: string, lang: string, country: string, url: string}
   */
  function stripVirtualPath(fPath, vPath, sitesObject) {
    if (
      typeof vPath === undefined ||
      vPath === null ||
      !sitesObject.get(vPath)
    ) {
      return sitesObject.get('default');
    }
    const siteProps = {
      ...sitesObject.get(vPath),
      url: fPath.replace(`/${vPath}`, ''),
    };
    // prepend slash if not exists - necessary for paths that rewrite home items
    // E.g. /brand-hub -> brand
    if (siteProps.url.substr(0, 1) !== '/') {
      siteProps.url = `/${siteProps.url}`;
    }
    return siteProps;
  }

  const match = reqUrl.match(
    /(^\/brand-hub)|(\/[a-z]{2}\/[a-z]{2}($|\/))|(\/[a-z]{2}($|\/))|\/(emea|global|apac|mdr)\/[a-z]{2}($|\/)/,
  );
  const virtualPath =
    typeof match === undefined || match === null
      ? null
      : match[0].replace(/^\/|\/$/g, '');

  return stripVirtualPath(reqUrl, virtualPath, sitesMap);
}
