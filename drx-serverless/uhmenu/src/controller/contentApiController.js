'use strict';

const ContentService = require('../service/contentService.js');

async function getHeader(authorizer, params, languageCode, app, personas) {
  const contentService = new ContentService(params);
  const countryCode = authorizer.countryCode;
  const resp = await contentService.getHeader(
    authorizer,
    countryCode,
    languageCode,
    app,
    personas
  );

  return resp;
}

module.exports = {getHeader};
