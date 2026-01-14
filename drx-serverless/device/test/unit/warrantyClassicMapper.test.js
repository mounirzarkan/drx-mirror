const expect = require('chai').expect;
const {
  dataToGroup,
  groupToValue
} = require('../../src/conversion/classicMapper/warrantyClassicMapper');

describe('warrantyClassicMapper', () => {
  describe('dataToGroup', () => {
    const contracts = [
      {
        terminatedDate: null,
        startDate: 1621641600000,
        installBaseId: null,
        expirationDate: 1653091200000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '3134439',
        accessoryId: 'a0h1j0000023rXmAAI'
      },
      {
        terminatedDate: null,
        startDate: 1621641600000,
        installBaseId: null,
        expirationDate: 1653091200000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '3134439',
        accessoryId: 'a0h1j0000023rYIAAY'
      },
      {
        terminatedDate: null,
        startDate: 1621641600000,
        installBaseId: null,
        expirationDate: 1653091200000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '3134439',
        accessoryId: 'a0h1j0000023rY3AAI'
      },
      {
        terminatedDate: null,
        startDate: 1621641600000,
        installBaseId: null,
        expirationDate: 1653091200000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '3134439',
        accessoryId: 'a0h1j0000023rYHAAY'
      },
      {
        terminatedDate: null,
        startDate: 1621641600000,
        installBaseId: null,
        expirationDate: 1629331200000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '3134439',
        accessoryId: 'a0h1j0000023rYDAAY'
      },
      {
        terminatedDate: null,
        startDate: 1660348800000,
        installBaseId: 'a0E1j000000dnaYEAQ',
        expirationDate: 1691798400000,
        description:
          'CUSTOMER:  Michael Babbitt  Warranty/Extended Warranty Contract',
        coverageStatus: 'SIGNED',
        contractType: 'Extended Warranty',
        contractNumber: 'W3237662',
        accessoryId: null
      },
      {
        terminatedDate: null,
        startDate: 1565568000000,
        installBaseId: 'a0E1j000000djL8EAI',
        expirationDate: 1660176000000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '2537867',
        accessoryId: null
      },
      {
        terminatedDate: null,
        startDate: 1565654400000,
        installBaseId: null,
        expirationDate: 1573344000000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: '2537869',
        accessoryId: 'a0h1j000000rE31AAE'
      },
      {
        terminatedDate: null,
        startDate: 1565654400000,
        installBaseId: null,
        expirationDate: 1573344000000,
        description:
          'CUSTOMER : Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'UNKNOWN',
        contractType: 'Other',
        contractNumber: '2537829',
        accessoryId: 'a0h1j000000rE31AAY'
      }
    ];
    it('dataToGroup with property installBaseId returns 2 groups', () => {
      const results = dataToGroup({contracts}, 'installBaseId');
      expect(Object.getOwnPropertyNames(results))
        .with.property('length')
        .to.equal(2);
    });

    it('dataToGroup with property accessoryId returns 6 groups', () => {
      const results = dataToGroup({contracts}, 'accessoryId');
      expect(Object.getOwnPropertyNames(results))
        .with.property('length')
        .to.equal(6);
    });
  });

  describe('groupToValue', () => {
    const groupedContracts = [
      {
        terminatedDate: null,
        startDate: 1660348800000,
        installBaseId: 'a0E1j000000dnaYEAQ',
        expirationDate: 1691798400000,
        description: 'CUSTOMER:  Michael Babbitt Warranty Contract',
        coverageStatus: 'ACTIVE',
        contractType: 'Warranty',
        contractNumber: 'W3237662',
        accessoryId: null
      },
      {
        terminatedDate: null,
        startDate: 1691798400000,
        installBaseId: 'a0E1j000000dnaYEAQ',
        expirationDate: 1711798400000,
        description:
          'CUSTOMER:  Michael Babbitt Warranty/Extended Warranty Contract',
        coverageStatus: 'SIGNED',
        contractType: 'Extended Warranty',
        contractNumber: 'W3237664',
        accessoryId: null
      }
    ];
    let results = undefined;
    beforeEach(() => {
      results = groupToValue(groupedContracts);
    });

    it('latestWarrantyDate matches 1711798400000.', () => {
      expect(results)
        .with.property('latestWarrantyDate')
        .to.equal(1711798400000);
    });

    it('warrantyDescription matches "Michael Babbitt Warranty/Extended Warranty Contract"', () => {
      expect(results)
        .with.property('warrantyDescription')
        .to.equal('Michael Babbitt Warranty/Extended Warranty Contract');
    });

    it('The length of the contracts array equals to 2', () => {
      expect(results)
        .with.property('contracts')
        .with.property('length')
        .to.equal(2);
    });

    it('When terminatedDate & expirationDate is null, latestWarrantyDate & warrantyDescriptionreturns null', () => {
      results = groupToValue([
        {
          terminatedDate: null,
          startDate: 1691798400000,
          installBaseId: 'a0E1j000000dnaYEAQ',
          expirationDate: null,
          description:
            'CUSTOMER:  Michael Babbitt Warranty/Extended Warranty Contract',
          coverageStatus: 'SIGNED',
          contractType: 'Extended Warranty',
          contractNumber: 'W3237664',
          accessoryId: null
        }
      ]);
      expect(results).with.property('latestWarrantyDate').to.equal(null);
      expect(results).with.property('warrantyDescription').to.equal(null);
    });

    it('When terminatedDate is specified, latestWarrantyDate equals 1711798400000', () => {
      results = groupToValue([
        {
          terminatedDate: 1711798400000,
          startDate: 1691798400000,
          installBaseId: 'a0E1j000000dnaYEAQ',
          expirationDate: 1713798400000,
          description:
            'CUSTOMER:  Michael Babbitt Warranty/Extended Warranty Contract',
          coverageStatus: 'SIGNED',
          contractType: 'Extended Warranty',
          contractNumber: 'W3237664',
          accessoryId: null
        }
      ]);
      expect(results)
        .with.property('latestWarrantyDate')
        .to.equal(1711798400000);
    });

    it('When description is missing, warrantyDescription equals null', () => {
      results = groupToValue([
        {
          terminatedDate: 1711798400000,
          startDate: 1691798400000,
          installBaseId: 'a0E1j000000dnaYEAQ',
          expirationDate: 1713798400000,
          description: null,
          coverageStatus: 'SIGNED',
          contractType: 'Extended Warranty',
          contractNumber: 'W3237664',
          accessoryId: null
        }
      ]);
      expect(results).with.property('warrantyDescription').to.equal(null);
    });
  });
});
