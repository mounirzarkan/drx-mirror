'use strict';

const {expect} = require('chai');
const {sageMapper} = require('../../../src/mapper/index');

describe('sageMapper', () => {
  describe('device detail', () => {
    const sageExpectedDeviceResponse = {
      classDeviceType: 'Sound Processor',
      contracts: [
        {
          description: 'Faulty or Damaged Device Replacement',
          end: 1740614400000
        }
      ],
      deviceStatus: 'Registered',
      deviceType: 'Sound Processor',
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
      modelColor: '',
      colour: '',
      customerFacingName: 'customer facing name',
      type: 'soundProcessors'
    };
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
            type: 'Sound Processor',
            name: 'Cp1000 Coil, Brown, 6cm',
            description: 'Cp1000 Coil, Brown, 6Cm',
            family: 'Sound Processor',
            subFamily: 'Sound Processor',
            partNumber: 'Z597504',
            customerFacingName: 'customer facing name',
            accessoryType: 'accessory Type'
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
    it('CASE: should map the Boomi Response to DRX API successfully for device detail', () => {
      sageExpectedDeviceResponse.fittingDate = 1702944000000;
      const result = sageMapper.convertSageDetailResponse(boomiResponseDevice);
      expect(result).to.deep.equal(sageExpectedDeviceResponse);
    });
    it('CASE: should map the Boomi Response to DRX API successfully for device detail - deviceType implant', () => {
      sageExpectedDeviceResponse.fittingDate = 1702944000000;
      sageExpectedDeviceResponse.surgeryDate =
        sageExpectedDeviceResponse.purchaseDate;
      sageExpectedDeviceResponse.deviceType = 'Implant';
      sageExpectedDeviceResponse.classDeviceType = 'Implant';
      sageExpectedDeviceResponse.type = 'implant';
      delete sageExpectedDeviceResponse.modelColor;
      delete sageExpectedDeviceResponse.colour;
      boomiResponseDevice.patientAsset.device.product.type = 'Implant';
      const result = sageMapper.convertSageDetailResponse(boomiResponseDevice);
      expect(result).to.deep.equal(sageExpectedDeviceResponse);
    });
    it('CASE: should map the Boomi Response to DRX API successfully for device detail - deviceType accessory', () => {
      const sageExpectedDeviceResponse = {
        classDeviceType: 'Sound Processor',
        contracts: [
          {
            description: 'Faulty or Damaged Device Replacement',
            end: 1740614400000
          }
        ],
        deviceStatus: 'Registered',
        deviceType: 'Sound Processor',
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
        customerFacingName: 'customer facing name',
        type: 'soundProcessors'
      };

      sageExpectedDeviceResponse.deviceType = 'Accessory';
      sageExpectedDeviceResponse.classDeviceType = 'Accessory';
      sageExpectedDeviceResponse.accessoryType = 'accessory Type';
      sageExpectedDeviceResponse.type = 'accessories';
      delete sageExpectedDeviceResponse.surgeryDate;
      boomiResponseDevice.patientAsset.device.product.type = 'Accessory';
      const result = sageMapper.convertSageDetailResponse(boomiResponseDevice);
      expect(result).to.deep.equal(sageExpectedDeviceResponse);
    });
  });
  describe('device list', () => {
    const sageExpectedDeviceListResponse = [
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
        customerFacingName: 'name 1',
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
        hasOpenSR: false,
        isSupported: false,
        customerFacingName: 'name 2',
        accessoryType: 'accessory type 2',
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
        customerFacingName: 'name 3',
        type: 'soundProcessors'
      }
    ];
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
              customerFacingName: 'name 1'
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
              customerFacingName: 'name 2',
              accessoryType: 'accessory type 2'
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
              customerFacingName: 'name 3'
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
    it('CASE: should map the Boomi Response to DRX API successfully for device list', () => {
      const result = sageMapper.convertSageListResponse(
        boomiResponseDeviceList
      );
      expect(result).to.deep.equal(sageExpectedDeviceListResponse);
    });
  });
});
