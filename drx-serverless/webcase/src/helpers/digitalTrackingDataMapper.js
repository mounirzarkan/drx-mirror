function digitalTrackingDataMapper(caseData) {
  const NOT_AVAILABLE = 'not available';

  const {
    utmId,
    utmCampaign,
    utmSource,
    utmMedium,
    utmContent,
    utmTerm,
    utmCreativeFormat,
    utmMarketingTactic,
    utmSourcePlatform,
    googleAnalyticsClientId,
    facebookId,
    webformUrl
  } = caseData;

  const digitalTrackingDataObj = {
    utm_id: utmId || NOT_AVAILABLE,
    utm_campaign: utmCampaign || NOT_AVAILABLE,
    utm_source: utmSource || NOT_AVAILABLE,
    utm_medium: utmMedium || NOT_AVAILABLE,
    utm_content: utmContent || NOT_AVAILABLE,
    utm_term: utmTerm || NOT_AVAILABLE,
    utm_creative_format: utmCreativeFormat || NOT_AVAILABLE,
    utm_marketing_tactic: utmMarketingTactic || NOT_AVAILABLE,
    utm_source_platform: utmSourcePlatform || NOT_AVAILABLE,
    Google_Analytics_Client_ID: googleAnalyticsClientId || '',
    FacebookID: facebookId || '',
    WebformURL: webformUrl || ''
  };

  return JSON.stringify(digitalTrackingDataObj);
}

module.exports = {
  digitalTrackingDataMapper
};
