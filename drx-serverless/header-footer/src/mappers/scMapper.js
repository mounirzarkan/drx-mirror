('use restrict');
const utils = require('../util/utils');
const log = require('../util/logUtil.js');
const {
  translationConfig,
  getDefaultLocale
} = require('../data/translationConfig.js');

const scMapper = function (source, countryCode, languageCode) {
  const header = source.header;
  const footer = source.footer;

  const uc = {};
  uc.langCode = languageCode || header.languageCode.value;
  uc.langText = header.languageText.value;

  const countryFlag = header.countryFlag.value;

  const imageProps = utils.getHtmlAttributes(countryFlag, 'image', [
    'src',
    'alt',
    'height',
    'width'
  ]);

  uc.flagImage = {
    height: imageProps.width || '',
    alt: imageProps.alt || '',
    width: imageProps.height || imageProps.width || '',
    src: imageProps.src || ''
  };

  uc.countryCode = countryCode;

  uc.languageList =
    header.languageList?.links?.map((x) => {
      const countryFlag = x.countryFlag.value;
      const imageProps = utils.getHtmlAttributes(countryFlag, 'image', [
        'src',
        'alt',
        'height',
        'width'
      ]);

      return {
        name: x.name || '',
        languageLabel: x.languageLabel.value || '',
        languageCode: x.languageCode.value || '',
        link: {
          href: x.link.url || '',
          text: x.link.text || x.name,
          target: x.link.target || ''
        },
        flagImage: {
          height: imageProps.width || '',
          alt: imageProps.alt || '',
          width: imageProps.height || imageProps.width || '',
          src: imageProps.src || ''
        }
      };
    }) || [];

  uc.source = 'sitecore';

  uc.mobileMenuMenuText = header.Shared.data.menuText.value;
  uc.mobileMenuCloseText = header.Shared.data.closeText.value;
  uc.footerCopyright = footer.Shared.data.copyright.value;

  uc.features = {};
  uc.features.universalHeader = header.useUniversalHeader.value;
  uc.features.profileLogo = header.showProfileLogo.value;
  uc.features.givenNameLast = header.showGivenNameLast.value;
  uc.features.showLanguageSelector =
    header.showLanguageSelector?.value || false;

  uc.headerMainNavigation = {home: {}, professional: {}};
  uc.headerMainNavigation.home.href = header.Shared.data.homeLink.url;
  uc.headerMainNavigation.home.text = header.Shared.data.homeLink.text;
  uc.headerMainNavigation.home.alternativeTitle = 'cochlear.com';

  uc.headerMainNavigation.professional.href =
    header.Shared.data.professionalsLink.url;
  uc.headerMainNavigation.professional.text =
    header.Shared.data.professionalsLink.text;
  uc.headerMainNavigation.professional.alternativeTitle = 'cochlear.com';

  uc.headerLinks = header.Shared.data.topNavList.links.map((x) => {
    return {
      href: x.link.url,
      text: x.link.text || x.name,
      target: x.link.target || ''
    };
  });

  uc.homepageLink = {};
  uc.homepageLink.href = header.Shared.data.homeLink.url;
  uc.homepageLink.text = header.Shared.data.homeLink.text;
  uc.homepageLink.target = header.Shared.data.homeLink.target || '';

  uc.loginLink = {};
  uc.loginLink.href = header.Shared.data.loginLink.url;
  uc.loginLink.text = header.Shared.data.loginLink.text;
  uc.loginLink.target = header.Shared.data.loginLink.target || '';

  uc.mobileHeaderLinks = header.Shared.data.additionalList.links.map((x) => {
    return {
      href: x.link.url,
      text: x.link.text || x.name,
      target: x.link.target || ''
    };
  });

  uc.mobileMenuContact = {};
  uc.mobileMenuContact.href = header.Shared.data.contactLink.url;
  uc.mobileMenuContact.text = header.Shared.data.contactLink.text;
  uc.mobileMenuContact.target = header.Shared.data.contactLink.target || '';

  uc.mobileMenuClinicfinder = {};
  uc.mobileMenuClinicfinder.href = header.Shared.data.clinicFinderLink.url;
  uc.mobileMenuClinicfinder.text = header.Shared.data.clinicFinderLink.text;
  uc.mobileMenuClinicfinder.target =
    header.Shared.data.clinicFinderLink.target || '';

  uc.footerLinks = {};
  uc.footerLinks.column1 = footer.Shared.data.columnOneLinks.links.map((x) => {
    return {
      href: x.link.url,
      text: x.link.text || x.name,
      target: x.link.target || ''
    };
  });

  uc.footerLinks.column2 = footer.Shared.data.columnTwoLinks.links.map((x) => {
    return {
      href: x.link.url,
      text: x.link.text || x.name,
      target: x.link.target || ''
    };
  });

  uc.footerLinks.column3 = footer.Shared.data.columnThreeLinks.links.map(
    (x) => {
      return {
        href: x.link.url,
        text: x.link.text || x.name,
        target: x.link.target || ''
      };
    }
  );

  uc.footerSocialLinks = footer.Shared.data.socials.links.map((x) => {
    const imageProps = utils.getHtmlAttributes(x.image.value, 'image', [
      'src',
      'alt',
      'height',
      'width'
    ]);

    return {
      link: {
        text: x.link.text || x.name,
        href: x.link.url,
        target: x.link.target
      },
      icon: {
        height: imageProps.width,
        alt: imageProps.alt,
        width: imageProps.height || imageProps.width,
        src: imageProps.src
      }
    };
  });

  return uc;
};

const addConfigMapping = function (mappedData, source) {
  log.debug('addConfigMapping, mappedData');
  log.debug(mappedData);

  log.debug('addConfigMapping, source');
  log.debug(source);

  mappedData.storeLogoutToken = source.storeLogoutToken.value;

  if (source.COCHLEAR_COOKIE_DOMAIN != undefined) {
    mappedData.configUrls = {};
    mappedData.configUrls.COCHLEAR_COOKIE_DOMAIN =
      source.COCHLEAR_COOKIE_DOMAIN.value;
    mappedData.configUrls.AUTH_UH_DROPDOWN_MENU =
      source.AUTH_UH_DROPDOWN_MENU.value;
    mappedData.configUrls.AUTH_REVOKE = source.AUTH_REVOKE.value;
    mappedData.configUrls.AUTH_AUTHORIZE = source.AUTH_AUTHORIZE.value;
    mappedData.configUrls.AUTH_CIM_RECIPIENT_LOGOUT =
      source.AUTH_CIM_RECIPIENT_LOGOUT.value;
    mappedData.configUrls.COCHLEAR_DRX_MAIN = source.COCHLEAR_DRX_MAIN.value;
    mappedData.configUrls.STORE_LOGOUT = source.STORE_LOGOUT.value;
    mappedData.configUrls.COCHLEAR_MCR = source.COCHLEAR_MCR.value;
    mappedData.configUrls.AUTHORIZE_USER_APP = source.AUTHORIZE_USER_APP.value;
    mappedData.configUrls.AUTHORIZE_USER_APP_AUTHORIZE_PATH =
      source.AUTHORIZE_USER_APP_AUTHORIZE_PATH.value;
    mappedData.configUrls.ASSETS_ENDPOINT = source.ASSETS_ENDPOINT.value;
  }
  return mappedData;
};

const translationMapping = function (
  countryCode,
  languageCode,
  englishSpeakingCountries
) {
  const translationKey = `${countryCode.toLowerCase()}-${languageCode.toLowerCase()}`;

  log.debug('translationMapping, countryCode');
  log.debug(countryCode);

  log.debug('translationMapping, languageCode');
  log.debug(languageCode);

  log.debug('translationMapping, englishSpeakingCountries');
  log.debug(englishSpeakingCountries);

  log.debug('translationMapping, translationKey');
  log.debug(translationKey);

  let language = getDefaultLocale(
    countryCode,
    languageCode,
    englishSpeakingCountries
  );

  if (translationConfig[translationKey]) {
    language = translationConfig[translationKey];
  }

  log.debug('translationMapping, sitecore language');
  log.debug(language);

  return language;
};

module.exports = {
  scMapper,
  addConfigMapping,
  translationMapping
};
