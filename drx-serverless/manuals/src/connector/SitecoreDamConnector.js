const axios = require('axios');
const {log} = require('../util/index.js');

class SitecoreDamConnector {
  constructor(params) {
    this.connection = axios.create({
      baseURL: params.sitecoreDamEndpoint,
      headers: {
        'X-Auth-Token': params.sitecoreDamApiKey
      }
    });
  }

  // Search for asset based on document number, in order to get the asset id
  async getAssetByDocumentNumber(documentNumber) {
    log.debug(
      'SitecoreDamConnector, getAssetByDocumentNumber: - documentNumber'
    );
    log.debug(documentNumber);

    const {data} = await this.connection.post(`/api/search`, {
      fullText: [documentNumber]
    });

    log.debug('SitecoreDamConnector, getAssetByDocumentNumber: - data');
    log.debug(data);

    return data;
  }

  // Get file details by file id
  async getFile(fileId) {
    log.debug('SitecoreDamConnector, getFile: - fileId');
    log.debug(fileId);

    const {data} = await this.connection.get(`/api/entities/${fileId}`);

    log.debug('SitecoreDamConnector, getFile: - data');
    log.debug(data);

    return data;
  }

  // Get event history (edits and updates etc.)
  async getEventHistory(fileId) {
    log.debug('SitecoreDamConnector, getEventHistory: - fileId');
    log.debug(fileId);

    const {data} = await this.connection.get(
      `/api/audit/raw/query/${fileId}?properties=IFUDocumentTitle&skip=0&take=25&sort=timestamp&order=Desc`
    );

    log.debug('SitecoreDamConnector, getEventHistory: - data');
    log.debug(data);

    return data;
  }

  // Get file history for asset
  async getFileHistory(assetId) {
    log.debug('SitecoreDamConnector, getFileHistory: - assetId');
    log.debug(assetId);

    try {
      const {data} = await this.connection.get(
        `/api/entities/${assetId}/relations/FileHistory`
      );

      log.debug('SitecoreDamConnector, getFileHistory: - data');
      log.debug(data);

      return data;
    } catch (err) {
      log.debug('SitecoreDamConnector, getFileHistory: - err');
      log.debug(err);
      return [];
    }
  }

  // Get public link id using asset id
  async getPublicLinkIdFromAssetId(assetId) {
    log.debug('SitecoreDamConnector, getPublicLinkIdFromAssetId: - assetId');
    log.debug(assetId);

    const {data} = await this.connection.get(
      `/api/entities/${assetId}/relations/AssetToPublicLink`
    );

    log.debug('SitecoreDamConnector, getPublicLinkIdFromAssetId: - data');
    log.debug(data);

    return data;
  }

  // Get public link id using file id
  async getPublicLinkIdFromFileId(fileId) {
    log.debug('SitecoreDamConnector, getPublicLinkIdFromFileId: - fileId');
    log.debug(fileId);

    try {
      const {data} = await this.connection.get(
        `/api/entities/${fileId}/relations/FileToPublicLink`
      );
      log.debug('SitecoreDamConnector, getPublicLinkIdFromFileId: - data');
      log.debug(data);

      return data;
    } catch (error) {
      log.debug(
        'SitecoreDamConnector, getPublicLinkIdFromFileId: - error' + error
      ); // Log any error that occurs
    }
  }

  // Get public link details
  async getPublicLink(publicLinkId) {
    log.debug('SitecoreDamConnector, getPublicLink: - publicLinkId');
    log.debug(publicLinkId);

    const {data} = await this.connection.get(`/api/entities/${publicLinkId}`);

    log.debug('SitecoreDamConnector, getPublicLink: - data');
    log.debug(data);

    return data;
  }

  // Get ifu file details
  async getFileToPublicLink(publicLinkId) {
    log.debug('SitecoreDamConnector, getFileToPublicLink: - publicLinkId');
    log.debug(publicLinkId);

    const {data} = await this.connection.get(
      `/api/entities/${publicLinkId}/relations/FileToPublicLink`
    );

    log.debug('SitecoreDamConnector, getFileToPublicLink: - data');
    log.debug(data);

    return data;
  }

  // Get Assets by Key Name's Parent ID
  async getAssetsByKeyParentId(keyName, parentId, addlQuery, noOfItems) {
    const {data} = await this.connection.get(
      `/api/entities/query?query=(Definition.Name%20==%22M.Asset%22%20AND%20Parent(%27${keyName}%27).id==${parentId}%20AND%20Parent(%27FinalLifeCycleStatusToAsset%27).id==544)${addlQuery}&take=${noOfItems}`
    );
    return data;
  }
}

module.exports = SitecoreDamConnector;
