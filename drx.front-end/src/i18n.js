import i18n from 'i18next';
import backend from 'i18next-chained-backend';
import localStorageBackend from 'i18next-localstorage-backend';
import fetchBackend from 'i18next-fetch-backend';
import { initReactI18next } from 'react-i18next';
import config from './temp/config';

/**
 * Initializes the i18next library to provide a translation dictionary to the app.
 * If your app is not multilingual, this file and references to it can be removed.
 * Elsewhere in the app to use the dictionary `import { t } from 'i18next'; ... t('key')`
 * @param {string} language Optional, the initial language. Only used for SSR; otherwise language set in RouteHandler.
 * @param {*} dictionary Optional, the dictionary to load. Only used for SSR; otherwise, the dictionary is loaded via JSS dictionary service.
 */
export default function i18nInit(language, dictionary) {
  return new Promise((resolve, reject) => {
    const options = {
      debug: false,
      lng: language || 'en',
      fallbackLng: false, // fallback to keys
      load: 'currentOnly', // e.g. don't load 'es' when requesting 'es-MX' -- Sitecore config should handle this
      useCookie: false, // using URLs and Sitecore to store language context, don't need a cookie

      interpolation: {
        escapeValue: false, // not needed for react
      },
    };

    if (dictionary) {
      // if we got dictionary passed, that means we're in a SSR context with a server-provided dictionary
      // so we do not want a backend, because we already know all possible keys
      options.resources = {};
      options.resources[language] = {
        translation: dictionary,
      };

      i18n.use(initReactI18next).init(options, error => {
        if (error) reject(error);
        resolve();
      });
    } else {
      // We're running client-side, so we get translation data from the Sitecore dictionary API using fetch backend
      // For higher performance (but less simplicity), consider adding the i18n chained backend to a local cache option like the local storage backend.

      const dictionaryServicePath = `${config.apiEndpoint}/utils/dictionary/{{lng}}`;

      options.backend = {
        backends: [
          localStorageBackend, // primary
          fetchBackend, // fallback
        ],
        backendOptions: [
          {
            prefix: 'i18next_drx-main_res_', // cache prefix use your app name here
            expirationTime: 5 * 60 * 1000, // cache for 5 minutes
          },
          {
            loadPath: dictionaryServicePath,
            parse: data => {
              const parsedData = JSON.parse(data);
              if (parsedData.phrases) {
                const obj = parsedData.phrases;
                // trim method removes whitespace from both sides of a string.
                // also remove empty values where key name has overwritten the key value
                Object.keys(obj).forEach(k => {
                  obj[k] = obj[k].trim();
                  if (obj[k] === k) {
                    obj[k] = '';
                  }
                });
                return obj;
              }
              return parsedData;
            },
          },
        ],
      };
      i18n
        .use(backend)
        .use(initReactI18next)
        .init(options, error => {
          if (error) reject(error);
          resolve();
        });
    }
  });
}
