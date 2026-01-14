'use strict';
const _ = require('lodash');
const deviceList = require('../../src/deviceList');
const {
  getWarrantyDateMap,
  convertProcessor,
  convertResponse,
  checkOpenServiceRequest,
  flattenList,
  filterList,
  // sortList,
  paginateList
} = deviceList;
const contract1 = require('../mock/contracts_1.json');
const sfResponse = require('../mock/SFResponse.json');
const sfResponse2 = require('../mock/sfDeviceList2.json');
const paginationList = require('../mock/pagination.json');
const soundProcessors = require('../mock/soundProcessors.json');
const flattenDevices = require('../mock/flattenDevices.json');
// const _ = require('lodash');
const expect = require('chai').expect;
// const type = require('type-detect');

const openSrList = '1040200346832,12345566778';

describe('deviceList', () => {
  describe('#getWarrantyDate', () => {
    it('should return one entry with expiration date', () => {
      const warrantyMap = getWarrantyDateMap(contract1.contracts);
      expect(warrantyMap.size).equal(1);
      expect(warrantyMap.keys()[0]).equal('a0E9E000000BQzpUAG');
      expect(warrantyMap.values()[0]).to.equal(1921034073000);
    });
  });
  describe('#convertProcessor', () => {
    // TODO check out why this is failing
    it.skip('should return ', () => {
      const data = convertProcessor(sfResponse.data);
      console.log(JSON.stringify(data));
      expect(data).to.be.a('Array');
      expect(data.length).equal(2);
      expect(data[0].productDescription).equal('CP910 PROCESSING UNIT (MOCHA)');
      expect(data[0].fittingDate).equal(1457654400000);
      expect(data[0].isSupported).to.be.true;
      expect(data[0].colour).equal('Mocha');
      expect(data[0].underWarranty).to.be.false;
      expect(data[0].latestWarrantyDate).to.be.null;
    });
  });
  describe('#convertResponse', () => {
    // TODO checkout why this is failing
    it.skip('should return ', () => {
      const resp = convertResponse(sfResponse2, {hasDeviceSupport: true});
      console.log(JSON.stringify(resp));
    });
    it('should throw on empty sfData ', () => {
      expect(
        convertResponse.bind(undefined, {data: {}}, {hasDeviceSupport: true})
      ).to.throw();
    });
  });
});

describe('filter | sort options | pagination', () => {
  it('should return be flat', () => {
    var ls = flattenList(sfResponse.data);
    expect(ls.length).equal(5);
  });

  it('should return be filtered', () => {
    var ls = flattenList(sfResponse.data);
    ls = filterList(ls, {
      filterValue: 'soundProcessors',
      filterField: 'type'
    });
    expect(ls[0].type).equal('soundProcessors');
  });

  describe('sort options', () => {
    it('when sorting by latestWarrantyDate asc return with nil sorted values last in the list', () => {
      const ls = deviceList.sortList(flattenDevices, {
        sortField: 'latestWarrantyDate',
        sortOrder: 'asc'
      });

      expect(ls[0].latestWarrantyDate).not.equal(null);
      expect(ls[1].latestWarrantyDate).not.equal(null);
      expect(ls[ls.length - 2].latestWarrantyDate).equal(null);
      expect(ls[ls.length - 1].latestWarrantyDate).equal(null);
    });

    it('when sorting by latestWarrantyDate asc return list with latestWarrantyDate in asc order', () => {
      const ls = deviceList.sortList(flattenDevices, {
        sortField: 'latestWarrantyDate',
        sortOrder: 'asc'
      });

      let prev = Number.NEGATIVE_INFINITY;

      const inAscOrder = ls
        .filter(({latestWarrantyDate}) => !_.isNil(latestWarrantyDate))
        .every(({latestWarrantyDate}) => {
          const equalGreater = prev <= latestWarrantyDate;
          prev = latestWarrantyDate;
          return equalGreater;
        });
      expect(inAscOrder).to.equal(true);
    });

    it('when sorting by latestWarrantyDate desc return null sorted values last in the list', () => {
      const ls = deviceList.sortList(flattenDevices, {
        sortField: 'latestWarrantyDate',
        sortOrder: 'desc'
      });
      expect(ls[0].latestWarrantyDate).not.equal(null);
      expect(ls[1].latestWarrantyDate).not.equal(null);
      expect(ls[ls.length - 2].latestWarrantyDate).equal(null);
      expect(ls[ls.length - 1].latestWarrantyDate).equal(null);
    });

    it('when sorting by latestWarrantyDate desc return list with latestWarrantyDate in desc order', () => {
      const ls = deviceList.sortList(flattenDevices, {
        sortField: 'latestWarrantyDate',
        sortOrder: 'desc'
      });

      let prev = Number.POSITIVE_INFINITY;
      const inDescOrder = ls
        .filter(({latestWarrantyDate}) => !_.isNil(latestWarrantyDate))
        .every(({latestWarrantyDate}) => {
          const equalLessThan = latestWarrantyDate <= prev;
          prev = latestWarrantyDate;
          return equalLessThan;
        });
      expect(inDescOrder).to.equal(true);
    });

    it('should return be sorted ASC', () => {
      var ls = flattenList(sfResponse.data);
      ls = deviceList.sortList(ls, {
        sortField: 'name',
        sortOrder: 'asc'
      });
      expect(ls[0].name).equal('A900');
      expect(ls[1].name).equal('B230');
      expect(ls[2].name).equal('R230');
      expect(ls[3].name).equal('Y900');
      expect(ls[4].name).equal('Z900');
    });

    it('should return be sorted DESC', () => {
      var ls = flattenList(sfResponse.data);
      ls = deviceList.sortList(ls, {
        sortField: 'name',
        sortOrder: 'desc'
      });
      expect(ls[4].name).equal('A900');
      expect(ls[3].name).equal('B230');
      expect(ls[2].name).equal('R230');
      expect(ls[1].name).equal('Y900');
      expect(ls[0].name).equal('Z900');
    });
  });

  describe('pagination', () => {
    it('return page 0', () => {
      const ls = paginateList(paginationList, 0, 10);
      expect(ls.length).equal(10);
      expect(ls[0].itemId).equal(0);
      expect(ls[9].itemId).equal(9);
    });

    it('return page 1', () => {
      const ls = paginateList(paginationList, 1, 10);
      expect(ls.length).equal(10);
      expect(ls[0].itemId).equal(10);
      expect(ls[9].itemId).equal(19);
    });

    it('return page 2', () => {
      const ls = paginateList(paginationList, 2, 10);
      expect(ls.length).equal(10);
      expect(ls[0].itemId).equal(20);
      expect(ls[9].itemId).equal(29);
    });

    it('return last page', () => {
      const ls = paginateList(paginationList, 3, 10);
      expect(ls.length).lessThan(10);
      expect(ls[0].itemId).equal(30);
    });

    it('return page 10', () => {
      const ls = paginateList(paginationList, 10, 10);
      expect(ls.length).equals(0);
    });

    it('return page 10', () => {
      const ls = paginateList(paginationList, 0, 3);
      const ls2 = paginateList(ls, 0);
      expect(ls2.length).equals(3);
    });
  });
});

describe('#checkOpenServiceRequest', () => {
  it('has open sr', () => {
    const deviceList = checkOpenServiceRequest(
      soundProcessors.soundProcessors,
      openSrList
    );
    // expect(deviceList.length).equal(3);
    console.log('################', deviceList);
  });
});

describe.skip('SUITE convertResponse:', () => {
  const sfDeviceResponseStr = JSON.stringify(
    require('../mock/sfDeviceResponse.json')
  );
  const convertSFdeviceResponse = require('../mock/convertSFdeviceResponse.json');

  // TODO - Dan can you look into this please
  it('CASE convertResponse converts sfDeviceResponse to expected result', () => {
    const sfDeviceResponse = JSON.parse(sfDeviceResponseStr);
    const result = convertResponse(sfDeviceResponse, {hasDeviceSupport: true});
    expect(result).to.deep.equal(convertSFdeviceResponse);
  });

  it('CASE convertResponse expects isSupported to equal false on each soundProcessorsV2 item', () => {
    const sfDeviceResponse = JSON.parse(sfDeviceResponseStr);
    const result = convertResponse(sfDeviceResponse, {hasDeviceSupport: false});
    result.data.soundProcessorsV2.forEach(({isSupported}) => {
      expect(isSupported).to.equal(false);
    });
  });
});
