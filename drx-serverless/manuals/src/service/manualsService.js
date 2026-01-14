'use strict';

const {log, stringifyUtil, utils} = require('../util/index.js');
const connectors = require('../connector/index.js');

const COCHLEAR_USER_GUIDES_COLLECTION_ID = '892862';
const OTICON_USER_GUIDES_COLLECTION_ID = '1045997';

//TODO: Use config for domain
const DEFAULT_DAM_ORIGIN = 'https://assets.cochlear.com';

class ManualsService {
  constructor(config) {
    this.config = config;
    this.damOrigin = config.damOrigin;
    console.log('=====> ManualsService: damOrigin = ' + config.damOrigin);
  }

  async getAllItems({ifuType}) {
    log.debug('ManualsService, getAllItems');

    const {SitecoreDamConnector} = connectors;
    const sitecoreDamConnector = new SitecoreDamConnector(this.config);

    //TODO: Use config for key name & parent id
    const KEY = 'CollectionToAsset';
    const PARENT_ID =
      ifuType === 'oticon'
        ? OTICON_USER_GUIDES_COLLECTION_ID
        : COCHLEAR_USER_GUIDES_COLLECTION_ID;

    // get first document to get total number of items
    const firstItemResponse = await sitecoreDamConnector.getAssetsByKeyParentId(
      KEY,
      PARENT_ID,
      '',
      1
    );

    const totalItems = firstItemResponse.total_items;
    log.debug(
      '=====> ManualsService, getAllItems: - totalItems = ' + totalItems
    );

    const itemResponses = await Promise.all(
      Array(Math.ceil(totalItems / 100))
        .fill()
        .map((unused, idx) =>
          sitecoreDamConnector.getAssetsByKeyParentId(
            KEY,
            PARENT_ID,
            `&sort=ApprovalDate&order=Desc&skip=${idx * 100}`,
            100
          )
        )
    );

    let fileId;

    // only map needed fields for items
    let allItems = itemResponses
      .flatMap(response => response.items)
      .map(item => {
        fileId = utils.matchIdFromEntityUrl(
          item.relations.MasterFile.children[0].href
        );
        return {
          documentNumber: item.properties.DocumentNumber,
          fileId: fileId,
          id: item.id,
          title: item.properties.IFUDocumentTitle,
          // description: item.properties.IFUDocumentDescription,
          regions: utils.convertCsvStringToArray(
            item.properties.IFUDocumentRegion ?? ''
          ),
          languages: utils.convertCsvStringToArray(
            item.properties.IFUDocumentLanguage ?? ''
          ),
          products: utils.convertCsvStringToArray(
            item.properties.IFUProductPlatform ?? ''
          ),
          printableRegions:
            item.properties.IFUPrintable?.map(item =>
              item.identifier.replace('Cochlear.Region.', '').toLowerCase()
            ) ?? [],
          // partNumber: item.properties.PartNumber
          //   ? item.properties.PartNumber
          //   : '',
          partNumberAPAC: item.properties.IFUPartNumberAPAC || '',
          partNumberCAM: item.properties.IFUPartNumberCAM || '',
          partNumberCLASA: item.properties.IFUPartNumberCLASA || '',
          partNumberEMEA: item.properties.IFUPartNumberEMEA || ''
          // pdfHref: 'https://assets.cochlear.com/work_in_progress',
          // publishDate: '1900-01-01'
          // pdfTitle: item.properties.Title
        };
      });

    return allItems;
  }

  async getFilteredItems(allItems, searchInput) {
    log.debug('ManualsService, getIfus: - searchInput');
    log.debug(searchInput);

    const {
      countryCodes,
      languageCodes,
      productCodes,
      pageNumber,
      itemsPerPage
    } = searchInput;

    //TODO: Use proper region-country mapping from Regions API
    const region = countryCodes
      ? utils.getRegionOfCountry(countryCodes[0].toUpperCase())
      : '';
    log.debug('=====> ManualsService, getFilteredItems: - region = ' + region);

    let filteredItems = allItems.filter(item => {
      return (
        (region === '' || item.regions.includes(region.toLowerCase())) &&
        (!languageCodes ||
          languageCodes.some(languageCode =>
            item.languages.includes(languageCode.toLowerCase())
          )) &&
        (!productCodes ||
          item.products.some(product =>
            productCodes.some(
              productCode =>
                product.trim().toLowerCase() === productCode.toLowerCase()
            )
          ))
      );
    });

    const totalItems = filteredItems.length;

    // Pagination
    filteredItems = utils.paginate(filteredItems, pageNumber, itemsPerPage);

    filteredItems = await Promise.all(
      filteredItems.map(async item => {
        log.debug(
          '=====> ManualsService, getFilteredItems: - printableRegions = ' +
            item.printableRegions
        );
        // Check if item is printable in the region

        item.isPrintable = item.printableRegions.includes(region.toLowerCase());
        log.debug(
          '=====> ManualsService, getFilteredItems: - isPrintable = ' +
            item.isPrintable
        );

        // Remove printableRegions field
        // delete item.printableRegions;

        // Create partNumber based on region
        item.partNumber = item[`partNumber${region}`];

        // Remove region-specific partNumber fields
        for (let key in item) {
          if (/^partNumber(APAC|CAM|CLASA|EMEA)$/.test(key)) {
            delete item[key];
          }
        }

        // Add public link and publish date to item
        return {
          ...item,
          ...(await this.getItemPublicLink(item.fileId))
        };
      })
    );

    // Add totalItems to response
    return {
      items: filteredItems,
      totalItems: totalItems,
      returnedItems: filteredItems.length
    };
  }

  async getItemPublicLink(fileId) {
    log.debug('ManualsService, getItemPublicLink: fileId = ' + fileId);

    const {SitecoreDamConnector} = connectors;
    const sitecoreDamConnector = new SitecoreDamConnector(this.config);

    const fileToPublicLinkResponse = await sitecoreDamConnector.getPublicLinkIdFromFileId(
      fileId
    );
    log.debug(
      'ManualsService, getItemPublicLink: fileToPublicLinkResponse = ' +
        fileToPublicLinkResponse
    );

    if (
      fileToPublicLinkResponse.children &&
      fileToPublicLinkResponse.children.length > 0
    ) {
      const publicLinkId = utils.matchIdFromEntityUrl(
        fileToPublicLinkResponse.children[0].href
      );
      log.debug(
        'ManualsService, getItemPublicLink: publicLinkId = ' + publicLinkId
      );

      const publicLinkResponse = await sitecoreDamConnector.getPublicLink(
        publicLinkId
      );
      log.debug(
        'ManualsService, getItemPublicLink: public_link = ' +
          publicLinkResponse.public_link
      );

      return {
        pdfHref: utils.replaceUrlDomain(
          publicLinkResponse.public_link,
          this.damOrigin || DEFAULT_DAM_ORIGIN
        ),
        ...utils.matchPublishDateFromLink(publicLinkResponse.public_link)
      };
    }

    return null;
  }

  async getVersions(searchInput) {
    log.debug('ManualsService, getVersions: - searchInput');
    log.debug(searchInput);

    const {SitecoreDamConnector} = connectors;
    const sitecoreDamConnector = new SitecoreDamConnector(this.config);

    const [eventHistoryResponse, fileHistoryResponse] = await Promise.all([
      sitecoreDamConnector.getEventHistory(searchInput),
      sitecoreDamConnector.getFileHistory(searchInput)
    ]);

    log.debug('ManualsService, getVersions: - eventHistoryResponse');
    log.debug(eventHistoryResponse);
    log.debug('ManualsService, getVersions: - fileHistoryResponse');
    log.debug(fileHistoryResponse);

    // try getting public link for each previous version if available
    if (
      fileHistoryResponse.children &&
      fileHistoryResponse.children.length > 0
    ) {
      const titlesAndStartingTimestamps = eventHistoryResponse.items?.map(
        item => {
          const titleChange = item?.data?.property_changes?.find(
            propertyChange => propertyChange.property === 'IFUDocumentTitle'
          );

          if (!titleChange?.value?.new) return;

          return {
            timestamp: item.timestamp,
            newTitle: titleChange.value.new
          };
        }
      );

      // If this exists, it represents the first title of the IFU
      const originalTitle =
        eventHistoryResponse.items
          ?.find(
            item =>
              item.event_type === 'Original Created' ||
              item.event_type === 'Original Updated'
          )
          ?.data?.property_changes?.find(
            propertyChange => propertyChange.property === 'IFUDocumentTitle'
          )?.value?.new ?? null;

      log.debug('ManualsService, getVersions: - titlesAndStartingTimestamps');
      log.debug(titlesAndStartingTimestamps);
      log.debug('ManualsService, getVersions: - originalTitle');
      log.debug(originalTitle);

      const previousVersions = fileHistoryResponse.children
        .map(child => utils.matchIdFromEntityUrl(child.href))
        .filter(versionId => versionId);

      log.debug(
        'ManualsService, getVersions: - previousVersions = ' + previousVersions
      );

      const previousVersionsLinks = await Promise.all(
        previousVersions.map(async id => {
          let publicLinkEntry;
          const fileToPublicLinkResponse = await sitecoreDamConnector.getPublicLinkIdFromFileId(
            id
          );
          if (
            fileToPublicLinkResponse.children &&
            fileToPublicLinkResponse.children.length > 0
          ) {
            const publicLinkId = utils.matchIdFromEntityUrl(
              fileToPublicLinkResponse.children[0].href
            );
            log.debug(
              'ManualsService, getVersions: - publicLinkId = ' + publicLinkId
            );

            const publicLinkResponse = await sitecoreDamConnector.getPublicLink(
              publicLinkId
            );
            log.debug('ManualsService, getVersions: - publicLinkResponse = ');
            log.debug(publicLinkResponse);

            log.debug(
              'ManualsService, getVersions: - this.damOrigin = ' +
                this.damOrigin
            );

            const matchedPublishDate = utils.matchPublishDateFromLink(
              publicLinkResponse.public_link
            );
            let title = null;

            if (matchedPublishDate.publishDate) {
              const publishDate = new Date(matchedPublishDate.publishDate);
              const latestTitleChange = titlesAndStartingTimestamps.find(
                ({timestamp}) => new Date(timestamp) < publishDate
              );

              if (latestTitleChange) {
                title = latestTitleChange.newTitle;
              } else {
                title = originalTitle;
              }
            }

            publicLinkEntry = {
              title,
              pdfHref: utils.replaceUrlDomain(
                publicLinkResponse.public_link,
                this.damOrigin || DEFAULT_DAM_ORIGIN
              ),
              ...matchedPublishDate
            };
          } else {
            publicLinkEntry = null;
          }

          log.debug(
            'ManualsService, getVersions: - publicLinkEntry = ' +
              publicLinkEntry
          );
          if (publicLinkEntry) {
            return publicLinkEntry;
          }

          // get previous version's pdf link if public link not available
          const entityResponse = await sitecoreDamConnector.getFile(id);
          log.debug(
            'ManualsService, getVersions: - entityResponse = ' + entityResponse
          );
          return {
            pdfHref: entityResponse.renditions.pdf?.[0]?.href || ''
          };
        })
      );

      log.debug(
        'ManualsService, getVersions: - previousVersionsLinks = ' +
          previousVersionsLinks
      );

      return previousVersionsLinks;
    } else {
      return {};
    }
  }

  async printIfus(formData) {
    log.debug('=====> ManualsService, printIfus');

    const sfWebCaseData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      subject: 'Docupack Request',
      reason: 'IFU Docupack Request',
      origin: 'Web',
      isSFHC: true,
      debugEmail: formData.debugEmail ?? '',
      description: this.constructDescription(formData)
    };

    const {WebCaseLambdaConnector} = connectors;
    const webCaseLambdaConnector = new WebCaseLambdaConnector(this.config);

    const response = await webCaseLambdaConnector.createWebCase(sfWebCaseData);

    return response;
  }

  constructDescription(formData) {
    log.debug('=====> ManualsService, constructDescription');
    log.debug('=====> ManualsService, formData.files');
    log.debug(formData.files);

    const sortedFiles = formData.files.sort((a, b) => a[0].localeCompare(b[0])); // Sort by partNumber

    // Iterate through formData.files, de-dup partNumbers and format each sub-array
    const uniquePartNumbers = new Set();

    const formattedFiles = sortedFiles
      .filter(([partNumber]) => {
        if (uniquePartNumbers.has(partNumber)) {
          return false; // Skip duplicate partNumber
        } else {
          uniquePartNumbers.add(partNumber);
          return true; // Keep unique partNumber
        }
      })
      .map(([partNumber, products, languages], index) => {
        const displayProducts =
          products.length >= 4
            ? 'Multiproduct'
            : products.length === 1
            ? stringifyUtil.toTitleCase(products[0])
            : stringifyUtil.toTitleCase(products.join(', '));
        const displayLanguages =
          languages.length >= 2
            ? 'Multilingual'
            : languages.length === 1
            ? languages[0].toUpperCase()
            : languages.map(lang => lang.toUpperCase()).join(', ');

        return `${index +
          1}. ${displayProducts} - ${partNumber} - ${displayLanguages}`;
      })
      .join('\n');

    // Construct the postal address, excluding PO if it's blank
    const postalAddress = `${formData.street}
                            ${formData.suburb}${
      formData.PO ? `\n${formData.PO}` : ''
    }
                            ${formData.state} ${formData.postcode}
                            ${formData.country}`;

    const description = `Description: Print Request\n
                          Personal Details:
                          Name: ${formData.firstName} ${formData.lastName}
                          Email: ${formData.email}
                          Phone: ${formData.phone}\n
                          Postal Address:
                          ${postalAddress}\n
                          Files:\n${formattedFiles}`;

    return description;
  }
}

module.exports = ManualsService;
