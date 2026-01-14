'use strict';
const _ = require('lodash');

/**
 * @param sfData - The data returned from the Salesforce API.
 * @param property - The property to group the contracts by.
 * @returns object containing contracts grouped by id
 */
function dataToGroup(sfData, property) {
  const contracts =
    (sfData &&
      sfData.contracts &&
      sfData.contracts.filter(
        (contract) =>
          contract[property] &&
          (contract.contractType === 'Warranty' ||
            contract.contractType === 'Extended Warranty' ||
            contract.contractType === 'Service')
      )) ||
    [];

  /* Grouping the contracts by the property passed in. */
  return _.groupBy(contracts, property);
}

/**
 * It takes an array of objects that have a startDate, terminatedDate, expirationDate, and description
 * property and returns an object that has a date, description, and contracts property
 * @param contracts - An array of objects that have the following properties: {terminatedDate,expirationDate,startDate,description}
 * @returns An object with a latestWarrantyDate, warrantyDescription, and contracts property.
 */
function groupToValue(contracts = []) {
  const descriptionContracts = contracts.map(
    ({terminatedDate, expirationDate, description}) => {
      const warrantyDate = [terminatedDate, expirationDate].find(
        Number.isInteger
      );
      const trimmedDescription = description
        ? description.replace(/^CUSTOMER *: */i, '').trim()
        : null;
      return {
        end: warrantyDate,
        description: trimmedDescription
      };
    }
  );

  const {end: latestWarrantyDate, description} = descriptionContracts.reduce(
    (highest, {end, description}) => {
      if (end > highest.end) {
        return {
          end,
          description
        };
      }
      return highest;
    },
    {end: Number.NEGATIVE_INFINITY}
  );

  return {
    underWarranty: latestWarrantyDate > Date.now(),
    latestWarrantyDate:
      latestWarrantyDate > Number.NEGATIVE_INFINITY ? latestWarrantyDate : null,
    warrantyDescription: description || null,
    contracts: descriptionContracts
  };
}

module.exports = {dataToGroup, groupToValue};
