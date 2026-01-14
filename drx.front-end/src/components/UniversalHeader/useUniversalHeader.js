import { useState, useEffect } from 'react';
import config from '../../config';
import { authenticationService } from '../../utils/_services';
import getCountryCochlearCom from '../../utils/getCountryCochlearCom';

const handleTokenUpdate = response => {
  const newToken = response.headers['x-amzn-remapped-authorization'];

  if (newToken) {
    authenticationService.updateCurrentUser(token);
  }
};

// Transform API response data into the required format
const transformData = ({
  homeUrl,
  uhData,
  tokenDetails,
  token,
  routeParams,
}) => ({
  homeUrl: homeUrl,
  headerMainNavigation: [],
  headerLinks: [],
  loginLink: {},
  profileMenu: uhData
    ? {
        initials: uhData.initial,
        email: uhData.email,
        uhmenuTitle: uhData.uhmenuTitle,
        recipientText: uhData.recipientText,
        recipientCarerText: uhData.recipientCarerText,
        carerText: uhData.carerText,
        dropDownList: uhData.dropDownList,
        logoutLabel: uhData.logoutLabel,
        onLogout: () => {
          const url = `${config.authorizeUser}/authorize?request=logout&origin=${encodeURIComponent(config.cochlearDotCom.replace('https://', ''))}`;
          console.log('[useUniversalHeader] redirect to:', url);
          window.location.replace(url);
        },
      }
    : null,
  showLogo: true,
  showLanguage: false,
});

const calculateLocale = (locale, country) => {
  console.log(
    '[calculateLocale] Calculating locale for:',
    locale,
    country,
  );

  const localeForCountry = {
    us: 'en',
    ca: 'en',
    uk: 'en',
    gb: 'en',
    ie: 'en',
    au: 'en',
    nz: 'en',

    it: 'it-IT',
    fr: 'fr-FR',
    nl: 'nl-NL',
    jp: 'ja-JP',
    kr: 'ko-KR',
    be: 'nl-FR',
    cz: 'cs-CZ',
  };

  var newLocale = localeForCountry[country];

  if (country === 'be') {
    newLocale = locale.includes('fr')
      ? 'fr-FR'
      : locale.includes('nl')
        ? 'nl-NL'
        : newLocale;
  }

  return newLocale;
};

const calculateSubdomain = (country, locale) => {
  const subdomainMap = {
    au: 'au/en',
    us: 'us/en',
    uk: 'uk/en',
    jp: 'jp/ja',
    kr: 'kr/ko',
    fr: 'fr/fr',
    it: 'it/it',
    nl: 'nl/nl',
    nz: 'nz/en',
    ie: 'ie/en',
    ca: 'ca/en',
    cz: 'cz/cs',
  };

  if (country === 'be') {
    return locale.includes('fr')
      ? 'be/fr'
      : locale.includes('nl')
        ? 'be/nl'
        : undefined;
  }

  return subdomainMap[country];
};

// Fetch data for the universal header
const fetchData = async ({
  token,
  tokenDetails,
  attributeDetails,
  routeParams,
}) => {
  const personas =
    attributeDetails && attributeDetails.personas
      ? attributeDetails.personas.map(i => i.toLowerCase())
      : [];

  const personasString =
    Array.isArray(personas) && personas.length > 0
      ? personas.join(',')
      : '';

  const cochlearId = tokenDetails?.sub || '';
  const locale = calculateLocale(
    tokenDetails?.locale,
    tokenDetails.countryCode.toLowerCase(),
  );
  const country = getCountryCochlearCom(tokenDetails.countryCode); //tokenDetails?.countryCode || 'us';
  const homeUrl = calculateSubdomain(country, locale)
    ? `${config.cochlearDotCom}/${calculateSubdomain(country, locale)}/home`
    : `${config.cochlearDotCom}/`;

  const response = await fetch(
    `${config.apiEndpoint}/contents/menu?id=${cochlearId}&app=drx&lng=${locale.substring(0, 2)}&personas=${personasString}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    authenticationService.renew(country);
  }

  const jsonResponse = await response.json();

  handleTokenUpdate(response);

  return transformData({
    homeUrl: homeUrl,
    uhData: jsonResponse?.data?.uhmenu,
    tokenDetails,
    routeParams,
    token,
  });
};

const useUniversalHeader = ({
  token,
  tokenDetails,
  attributeDetails,
  routeParams,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || !tokenDetails?.sub) return;

    const fetchHeaderData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchData({
          token,
          tokenDetails,
          attributeDetails,
          routeParams,
        });
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderData();
  }, [token, tokenDetails?.sub, attributeDetails, routeParams]);

  return { data, error, isLoading };
};

export { useUniversalHeader };
