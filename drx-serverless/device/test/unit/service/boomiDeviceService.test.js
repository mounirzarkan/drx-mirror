'use strict';

const sinon = require('sinon');
const {expect} = require('chai');

const {BoomiDeviceService} = require('../../../src/service/index.js');
const connectors = require('../../../src/connector/index.js');

describe('SUITE: BoomiDeviceService - Unit Integration Test', () => {
  const configStr = JSON.stringify({
    scEndpoint: 'scEndpoint',
    sfHostname: 'sfHostname',
    sfClientId: 'sfClientId',
    sfUserName: 'sfUserName',
    secret: {
      scp_env_username: 'scp_env_username',
      scp_env_password: 'scp_env_password',
      sc_apikey: 'sc_apikey'
    },
    _env: 'DEV',
    privacyRulesSeconds: 7200,
    userSessionSeconds: 7200,
    userSessionPrefix: 'drx-dev-'
    // cacheRepo: {get: function() {}, save: function() {}},
  });
  const queryParams = {
    filterParams: {},
    sortParams: {}
  };

  describe('SUITE: getDeviceList flow', () => {
    let deviceService = undefined;

    const boomiResponseDeviceList = {
      _meta: {
        totalRecords: 94,
        page: 1,
        limit: 20,
        count: 3
      },
      patientAsset: [
        {
          id: '02i6N00000MG5YZQA1',
          name: 'Cp1000 Coil, Brown, 6Cm',
          status: 'Registered',
          earSide: 'Unknown',
          startDate: '2023-12-19',
          hasOpenSR: false,
          device: {
            id: '100460516',
            lotNumber: 'A',
            product: {
              id: '2580785',
              name: 'Cp1000 Coil, Brown, 6cm',
              productType: 'Implant',
              description: 'Cp1000 Coil, Brown, 6Cm',
              partNumber: 'Z597504',
              family: 'Implant',
              subFamily: 'Implant',
              customerFacingName: 'customer facing 1'
            }
          },
          entitlements: [
            {
              name: 'Faulty or Damaged Device Replacement',
              startdate: '2023-12-05',
              enddate: '2025-02-27',
              status: 'Active',
              type: 'Device'
            }
          ],
          insight: {
            soldAsUpgrade: 'false'
          }
        },
        {
          id: '02i6N00000Le0ZYQAZ',
          name: 'CP1000 COIL, BROWN, 8CM',
          status: 'Registered',
          earSide: 'Unknown',
          startDate: '2023-05-24',
          hasOpenSR: false,
          device: {
            id: '88858401',
            lotNumber: 'A',
            product: {
              id: '2580784',
              name: 'Cp1000 Coil, Brown, 8cm',
              productType: 'Accessory',
              description: 'Cp1000 Coil, Brown, 8Cm',
              partNumber: 'Z597505',
              family: 'Accessory',
              subFamily: 'Accessory',
              customerFacingName: 'customer facing 2',
              accessoryType: 'type 1'
            }
          },
          entitlements: [
            {
              name: 'Faulty or Damaged Device Replacement',
              startdate: '2023-05-10',
              enddate: '2024-05-23',
              status: 'Expired',
              type: 'Device'
            }
          ],
          insight: {
            soldAsUpgrade: 'false'
          }
        },
        {
          id: '02i6N00000Le0ZUQAZ',
          name: 'CP1000 COIL, BROWN, 6CM',
          status: 'Registered',
          earSide: 'Unknown',
          startDate: '2023-04-27',
          hasOpenSR: true,
          serviceRequestID: '15924690',
          device: {
            id: '88351599',
            lotNumber: 'A',
            product: {
              id: '2580785',
              name: 'Cp1000 Coil, Brown, 6cm',
              productType: 'Sound Processor',
              description: 'Cp1000 Coil, Brown, 6Cm',
              partNumber: 'Z597504',
              family: 'Sound Processor',
              subFamily: 'Sound Processor',
              customerFacingName: 'customer facing 3'
            }
          },
          entitlements: [
            {
              name: 'Faulty or Damaged Device Replacement',
              startdate: '2023-04-13',
              enddate: '2025-02-27',
              status: 'Active',
              type: 'Device'
            }
          ],
          insight: {
            soldAsUpgrade: 'false'
          }
        }
      ]
    };

    const getDeviceListResult = JSON.stringify([
      {
        serialNumber: undefined,
        productName: 'Cp1000 Coil, Brown, 6cm',
        productFamily: '',
        partNumber: 'Z597504',
        productId: '2580785',
        productDescription: 'Cp1000 Coil, Brown, 6Cm',
        id: '02i6N00000MG5YZQA1',
        deviceType: 'Implant',
        deviceStatus: 'Registered',
        customerFacingName: 'customer facing 1',
        modelNumber: 'Cp1000 Coil, Brown, 6cm',
        classDeviceType: 'Implant',
        underWarranty: true,
        latestWarrantyDate: 1740614400000,
        warrantyDescription: 'Faulty or Damaged Device Replacement',
        earSide: 'Unknown',
        fittingDate: 1702944000000,
        purchaseDate: 1702944000000,
        surgeryDate: 1702944000000,
        contracts: [
          {
            end: 1740614400000,
            description: 'Faulty or Damaged Device Replacement'
          }
        ],
        hasOpenSR: false,
        isSupported: false,
        type: 'implant'
      },
      {
        serialNumber: undefined,
        productName: 'Cp1000 Coil, Brown, 8cm',
        productFamily: '',
        partNumber: 'Z597505',
        productId: '2580784',
        productDescription: 'Cp1000 Coil, Brown, 8Cm',
        id: '02i6N00000Le0ZYQAZ',
        deviceType: 'Accessory',
        deviceStatus: 'Registered',
        customerFacingName: 'customer facing 2',
        modelNumber: 'Cp1000 Coil, Brown, 8cm',
        classDeviceType: 'Accessory',
        underWarranty: false,
        latestWarrantyDate: 1716422400000,
        warrantyDescription: 'Faulty or Damaged Device Replacement',
        contracts: [
          {
            description: 'Faulty or Damaged Device Replacement',
            end: 1716422400000
          }
        ],
        earSide: 'Unknown',
        purchaseDate: 1684886400000,
        accessoryType: 'type 1',
        hasOpenSR: false,
        isSupported: false,
        type: 'accessories'
      },
      {
        serialNumber: undefined,
        productName: 'Cp1000 Coil, Brown, 6cm',
        productFamily: '',
        partNumber: 'Z597504',
        productId: '2580785',
        productDescription: 'Cp1000 Coil, Brown, 6Cm',
        id: '02i6N00000Le0ZUQAZ',
        deviceType: 'Sound Processor',
        deviceStatus: 'Registered',
        customerFacingName: 'customer facing 3',
        modelNumber: 'Cp1000 Coil, Brown, 6cm',
        classDeviceType: 'Sound Processor',
        underWarranty: true,
        latestWarrantyDate: 1740614400000,
        warrantyDescription: 'Faulty or Damaged Device Replacement',
        earSide: 'Unknown',
        fittingDate: 1682553600000,
        purchaseDate: 1682553600000,
        colour: '',
        modelColor: '',
        contracts: [
          {
            end: 1740614400000,
            description: 'Faulty or Damaged Device Replacement'
          }
        ],
        hasOpenSR: true,
        isSupported: false,
        type: 'soundProcessors'
      }
    ]);

    beforeEach(() => {
      const config = JSON.parse(configStr);
      deviceService = new BoomiDeviceService(
        {
          ...config,
          cache: {
            getCustomKeyCache: function () {},
            saveCustomKeyInCache: function () {}
          },
          cacheRepo: {get: function () {}, save: function () {}}
        },
        queryParams
      );
    });

    it('CASE: Requestor calls get device list - returns list of own devices', async () => {
      const cochlearId = '198835944744967';
      const hasDeviceSupport = true;
      const sub = '198835944744967';
      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() {}

          getToken() {
            return JSON.parse();
          }
          getDeviceList() {
            return boomiResponseDeviceList;
          }
        })()
      );
      const result = await deviceService.getDeviceList(
        cochlearId,
        hasDeviceSupport,
        sub
      );
      expect(JSON.parse(result)).to.deep.equal(JSON.parse(getDeviceListResult));
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: getDevice flow', () => {
    let deviceService = undefined;

    const boomiResponseDevice = {
      patientAsset: {
        id: '02i6N00000MG5YZQA1',
        Name: 'Cp1000 Coil, Brown, 6Cm',
        earSide: 'Unknown',
        startDate: '2023-12-19',
        hasOpenSR: false,
        status: 'Registered',
        device: {
          id: '100460516',
          lotNumber: 'A',
          product: {
            id: '2580785',
            type: 'Accessory',
            name: 'Cp1000 Coil, Brown, 6cm',
            description: 'Cp1000 Coil, Brown, 6Cm',
            family: 'Accessory',
            subFamily: 'Accessory',
            partNumber: 'Z597504',
            customerFacingName: 'name 1',
            accessoryType: 'type 3'
          }
        },
        owner: {
          patient: {
            cochlearId: '259593421525886',
            primaryCountryCode: 'US'
          }
        },
        organisation: {
          cochlearId: '241848461770870',
          organisationType: 'provider',
          name: 'NYU Medical Center'
        },
        entitlements: [
          {
            name: 'Faulty or Damaged Device Replacement',
            startDate: '2023-12-05',
            endDate: '2025-02-27',
            status: 'Active',
            type: 'Device'
          }
        ]
      }
    };

    const getDeviceResult = {
      classDeviceType: 'Accessory',
      contracts: [
        {
          description: 'Faulty or Damaged Device Replacement',
          end: 1740614400000
        }
      ],
      deviceStatus: 'Registered',
      deviceType: 'Accessory',
      earSide: 'Unknown',
      hasOpenSR: false,
      isSupported: false,
      id: '02i6N00000MG5YZQA1',
      latestWarrantyDate: 1740614400000,
      modelNumber: 'Cp1000 Coil, Brown, 6cm',
      partNumber: 'Z597504',
      productDescription: 'Cp1000 Coil, Brown, 6Cm',
      productFamily: '',
      productId: '2580785',
      productName: 'Cp1000 Coil, Brown, 6cm',
      purchaseDate: 1702944000000,
      serialNumber: undefined,
      underWarranty: true,
      warrantyDescription: 'Faulty or Damaged Device Replacement',
      customerFacingName: 'name 1',
      accessoryType: 'type 3',
      type: 'accessories'
    };

    beforeEach(() => {
      const config = JSON.parse(configStr);
      deviceService = new BoomiDeviceService(
        {
          ...config,
          cache: {
            getCustomKeyCache: function () {},
            saveCustomKeyInCache: function () {}
          },
          cacheRepo: {get: function () {}, save: function () {}}
        },
        queryParams
      );
    });

    it('CASE: Requestor calls get device list - returns device detail', async () => {
      const cochlearId = '198835944744967';
      const deviceId = '123';
      const sub = '198835944744967';

      sinon.stub(connectors, 'BOOMIConnector').returns(
        new (class {
          constructor() {}

          getToken() {
            return JSON.parse();
          }
          getDevice() {
            return boomiResponseDevice;
          }
        })()
      );

      const result = await deviceService.getDevice(deviceId, cochlearId, sub);
      expect(result).to.deep.equal(getDeviceResult);
    });

    afterEach(() => {
      sinon.restore();
    });
  });
});
