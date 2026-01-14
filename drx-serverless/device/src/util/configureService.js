const {BOOMIConnector, SFConnector} = require('../connector/index.js');
const {SFIntegrationToken} = require('../token/index.js');
const {
  BOOMIEquipmentConversion,
  EquipmentConversion
} = require('../conversion/index.js');
const {USER_FLOW} = require('./getUserFlow.js');
const {API} = require('./boomiApiKeys.js');

async function configureService(userFlow, configuration) {
  let connector;
  let conversionTool;

  // create boomi connector and conversion tool
  if (userFlow === USER_FLOW.SAGE) {
    connector = new BOOMIConnector(configuration, API.DEVICE);
    conversionTool = new BOOMIEquipmentConversion();
  }

  // create boomi mock connector and conversion tool
  if (userFlow === USER_FLOW.SAGE_MOCK) {
    // ToDo: to be completed once sage mocks done
  }

  // create sf connector and conversion tool
  if (userFlow === USER_FLOW.DEFAULT) {
    // ToDo: refactor to handle token within SCConnector using axios interceptors (as per BOOMIConnector)
    const credentials = new SFIntegrationToken(configuration);
    const token = await credentials.getCacheToken();

    connector = new SFConnector(token);
    conversionTool = new EquipmentConversion(configuration.hasDeviceSupport);
  }

  return [connector, conversionTool];
}

module.exports = {
  configureService
};
