'use strict';

const axios = require("axios");
const reCapUrl = "https://www.google.com/recaptcha/api/siteverify";
const log = require('./logUtil.js');

const RECAPTCHA_THRESHOLD = 0.5;

/*
response
{
  success: true,
  challenge_ts: '2023-04-20T06:20:59Z',
  hostname: 'localhost',
  score: 0.9,
  action: 'submit'
}
*/

async function verifyToken(token, recaptchaSecretKey) {
  // verify the result by POSTing to google backend with secret and
  // frontend recaptcha token as payload
  let verifyResult = await axios({
    method: "post",
    url: reCapUrl,
    params: {
      secret: recaptchaSecretKey,
      response: token,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
    },
  });

  // Enable to see the result
  log.debug(verifyResult.data);

  if (verifyResult.status === 200) {
    // Response was ok - but could still be a failed validation
    if (
      verifyResult.data.success === true &&
      verifyResult.data.score > RECAPTCHA_THRESHOLD
    ) {
      log.debug("reCaptcha check passed threshold!");
      return true;
    } else {
      log.debug("reCaptcha check failed. Most likely SPAM.");
      return false;
    }
  } else {
    log.debug(
      "Something went wrong when trying to connect to google recaptcha verify. Please check the url or reCaptchaSecret."
    );
    return false;
  }
}

module.exports = {
  verifyToken,
};
