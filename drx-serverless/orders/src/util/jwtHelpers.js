'use strict';

const jsonwebtoken = require('jsonwebtoken');
const TYPE_CARER = 'Carer';

/**
 * Get partyId by cochlearId
 *
 * @param {string} jwtToken
 * @param {string} cochlearId to find party Id for
 * @return {string} PartyId
 */
function getPartyIdForCochlearId(jwtToken, cochlearId) {
  let partyId = null;
  const decodedJwtToken = jsonwebtoken.decode(jwtToken, {complete: true});
  console.log('getPartyIdForCochlearId - JWT Token:');
  console.log(decodedJwtToken);

  if (getCochlearId(decodedJwtToken.payload) === cochlearId) {
    partyId = getPartyId(decodedJwtToken.payload);
  } else if (getUserType(decodedJwtToken.payload) === TYPE_CARER) {
    const recipientsString = getRecipients(decodedJwtToken.payload);
    let recipients;
    try {
      recipients = JSON.parse(recipientsString);
    } catch (error) {
      recipients = [];
      console.error(
        'Could not parse recipients. {0}\n{1}',
        error.message,
        error.stack
      );
    }

    // Find matching recipient
    const match = recipients.find((r) => r.CochlearId === cochlearId);
    partyId = match ? match.PartyId : null;
  }

  console.log('getPartyIdForCochlearId - partyId:');
  console.log(partyId);

  return partyId;
}

/**
 * Get Cochlear user type
 *
 * @return {string|null} Carer, Recipient or null
 */
function getUserType(parsedJWT) {
  return parsedJWT ? parsedJWT['https://www.cochlear.com/user_type'] : null;
}

/**
 * Get Cochlear partyId
 *
 * @return {string|null} PartyId or null
 */
function getPartyId(parsedJWT) {
  return parsedJWT ? parsedJWT['https://www.cochlear.com/party_id'] : null;
}

/**
 * Get Cochlear id
 *
 * @return {string|null} cochlear or null
 */
function getCochlearId(parsedJWT) {
  return parsedJWT ? parsedJWT['https://www.cochlear.com/cochlear_id'] : null;
}

/**
 * Get recipients
 *
 * @return {[]} cochlear or null
 */
function getRecipients(parsedJWT) {
  return parsedJWT ? parsedJWT['https://www.cochlear.com/recipient'] : [];
}

module.exports = {
  getPartyIdForCochlearId: getPartyIdForCochlearId
};
