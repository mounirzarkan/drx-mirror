const log = require('../util/logUtil.js');
const PARTY_ID_CACHE_KEY_PREFIX = 'cacheUserPartyId-';

// store sub partyId in redis.
async function savePartyIdToCache(params, cochlearId, partyId) {
  if (cochlearId) {
    const subPartyIdKey =
      params._userSessionPrefix + PARTY_ID_CACHE_KEY_PREFIX + cochlearId;
    log.debug('savePartyIdToCache - subPartyIdKey');
    log.debug(subPartyIdKey);
    await params._cache.save(
      subPartyIdKey,
      JSON.stringify(partyId),
      Number.parseInt(params._userSessionSeconds, 10)
    );
  } else {
    log.debug('savePartyIdToCache - empty cochlearId || partyId');
    log.debug(cochlearId, partyId);
  }
}

// store recipients partyId in redis
async function saveRecipientsPartyId(params, _recipients) {
  log.debug('saveRecipientsPartyId - _recipients');
  log.debug(_recipients);
  if (Array.isArray(_recipients)) {
    for (let x = 0; x < _recipients.length; x++) {
      const _recipient = _recipients[x];
      log.debug('saveRecipientsPartyId - _recipient');
      log.debug(_recipient);
      if (_recipient) {
        await savePartyIdToCache(
          params,
          _recipient['CochlearId'],
          _recipient['PartyId']
        );
      }
    }
  }
}

async function renewPartyIdInCache(params, cochlearId) {
  if (cochlearId) {
    const subPartyIdKey =
      params._userSessionPrefix + PARTY_ID_CACHE_KEY_PREFIX + cochlearId;
    log.debug('renewPartyIdInCache - subPartyIdKey');
    log.debug(subPartyIdKey);
    const partyIdStr = await params._cache.get(subPartyIdKey);
    log.debug('renewPartyIdInCache - partyIdStr');
    log.debug(partyIdStr);
    if (partyIdStr) {
      const partyId = JSON.parse(partyIdStr);
      log.debug('renewPartyIdInCache - partyId');
      log.debug(partyId);
      await savePartyIdToCache(params, cochlearId, partyId);
    }
  }
}

async function renewRecipientsPartyId(params, _recipients) {
  log.debug('renewRecipientsPartyId - _recipients', _recipients);
  if (Array.isArray(_recipients)) {
    for (let x = 0; x < _recipients.length; x++) {
      const _recipient = _recipients[x];
      log.debug('renewRecipientsPartyId - _recipient', _recipient);
      if (_recipient) {
        await renewPartyIdInCache(params, _recipient['CochlearId']);
      }
    }
  }
}

module.exports = {
  savePartyIdToCache,
  saveRecipientsPartyId,
  renewPartyIdInCache,
  renewRecipientsPartyId
};
