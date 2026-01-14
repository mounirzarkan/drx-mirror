('use restrict');

const BuildContractCommand = require('../commands/buildContractCommand.js');

class ContentService {
  constructor(config) {
    this.cmd = new BuildContractCommand(config);
  }

  async getHeaderFooter(lng, country) {
    try {
      const resp = await this.cmd.execute(lng, country);
      return resp;
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = ContentService;
