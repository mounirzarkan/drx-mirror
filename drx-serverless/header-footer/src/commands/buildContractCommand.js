'use restrict';

const log = require('../util/logUtil.js');
const {scMapper, addConfigMapping} = require('../mappers/scMapper.js');
const SCConnector = require('../connector/SCConnector.js');

class buildContractCommand {
  constructor(config) {
    this.scApiKey = config._scApiKey;
    this.aws_secret = config._aws_secret;
    this.isScHttpAgent = config._isScHttpAgent;

    log.debug('buildContractCommand englishSpeakingCountries');
    log.debug(this.aws_secret.englishSpeakingCountries);

    this.scConnector = new SCConnector(
      config._scEndpoint,
      config._aws_secret,
      this.isScHttpAgent
    );
  }

  async execute(languageCode, countryCode) {
    log.debug('START - BuildContractCommand - execute: ');
    log.debug(countryCode);
    log.debug(languageCode);
    log.debug(this.scApiKey);
    log.debug(this.aws_secret);

    try {
      const header = await this.scConnector.getHeaderResponse(
        countryCode,
        languageCode
      );
      log.debug('BuildContractCommand - header :');
      log.debug(header);

      const footer = await this.scConnector.getFooterResponse(
        countryCode,
        languageCode
      );
      log.debug('BuildContractCommand - footer :');
      log.debug(footer);

      var scResp = {
        header: header.item,
        footer: footer.item
      };

      log.debug('BuildContractCommand - scResp :');
      log.debug(scResp);

      const mappedData = this.doScMapping(scResp, countryCode, languageCode);
      log.debug('BuildContractCommand - mappedData :');
      log.debug(mappedData);

      return mappedData;
    } catch (error) {
      log.debug('ERROR - BuildContractCommand - execute - SC: ');
      log.debug(error);
      throw error;
    }
  }

  doScMapping(resp, countryCode, languageCode) {
    log.debug('BuildContractCommand, doScMapping - resp :');
    log.debug(resp);

    log.debug('BuildContractCommand, doScMapping - countryCode :');
    log.debug(countryCode);

    log.debug('BuildContractCommand, doScMapping - languageCode :');
    log.debug(languageCode);

    let mappedData = scMapper(resp, countryCode, languageCode);

    try {
      mappedData = addConfigMapping(mappedData, resp.header);
    } catch (error) {
      log.debug('ERROR - BuildContractCommand - doScMapping: ');
      log.debug(error);
    }

    return mappedData;
  }
}

module.exports = buildContractCommand;
