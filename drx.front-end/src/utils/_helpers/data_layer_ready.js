import objectAssignPolyfill from '../objectAssignPolyfill.js';
export default (params, route, context) => {
  objectAssignPolyfill();
  if (typeof window !== 'undefined') {
    // return category values from the url
    const items =
      params &&
      params.sitecoreRoute &&
      params.sitecoreRoute.split('/');
    const categoryListStr =
      items &&
      items.map((item, index) => {
        return `{"subCategory${index + 1}":"${item}"}`;
      });
    const categories =
      categoryListStr &&
      categoryListStr.map(item => {
        return JSON.parse(item);
      });
    const categoriesObj =
      categories &&
      categories.reduce((total, item) => {
        return Object.assign(total, item);
      }, {});
    if (categoriesObj) {
      Object.assign(categoriesObj, {
        pageType: route && route.templateName,
      });
    }

    // Gathering the domain/subdomain
    const hostname = window && window.document.domain;
    const topLevel = new RegExp('.(com.au|co.uk|me|com|us|es|fr|it)');
    const tmpDomain = hostname.replace(topLevel, '');
    const mainDomain = tmpDomain && tmpDomain.split('.').pop();
    const subDomain = mainDomain && tmpDomain.split(mainDomain)[0];

    // Gathering sysEnv
    let envStr = '';
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      envStr = 'mobile';
    } else if (
      navigator.userAgent.match(/Mac/i) ||
      navigator.userAgent.match(/Linux/i) ||
      navigator.userAgent.match(/Win/i) ||
      navigator.userAgent.match(/Unix/i)
    ) {
      envStr = 'desktop';
    } else {
      envStr = 'tablet';
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'DataLayer Ready',
      page: {
        pageInfo: {
          country: (params && params.country) || 'US',
          domain: mainDomain,
          language: (params && params.lang) || 'en',
          pageID: route && route.itemId,
          pageTitle:
            context && context.metadata && context.metadata.title,
          pageURL: window && window.location.href,
          publicationDate: '', // api.publishDate,
          subDomain: subDomain,
          sysEnv: envStr, // “desktop”, “mobile”, “tablet”
          updatedDate:
            context &&
            context.metadata &&
            context.metadata.lastUpdated, //api.updatedDate,
        },
        category: categoriesObj,
      },
      user: {
        profileInfo: {
          visitorType: '', //”New”, “Returning”
          segment: '', // Definitions TBC
        },
      },
    });
  }
};
