'use strict';

const {expect} = require('chai');
const {
  ChainValidation,
  PropertyValidation
} = require('../../../src/validation/index.js');

describe('SUITE: PropertyValidation', () => {
  const longStr222 =
    '##############################################################################################################################################################################################################################';
  const inputDataStr = JSON.stringify({
    country: {
      id: 2077456,
      code: 'AU',
      isoCode: 'AUS',
      languages: ['en-AU'],
      name: 'Australia',
      postalCodeFormat: '####',
      currencyCode: 'AUD'
    },
    regions: [
      {
        abbr: 'ACT',
        nane: 'Australian Capital Territory'
      },
      {
        abbr: 'NT',
        nane: 'Northern Territory'
      },
      {
        abbr: 'NSW',
        nane: 'New South Wales'
      },
      {
        abbr: 'QLD',
        nane: 'Queensland'
      },
      {
        abbr: 'SA',
        nane: 'South Australia'
      },
      {
        abbr: 'TAS',
        nane: 'Tasmania'
      },
      {
        abbr: 'VIC',
        nane: 'Victoria'
      },
      {
        abbr: 'WA',
        nane: 'Western Australia'
      }
    ]
  });
  it('CASE : When object properties string lengths are less then 200 return result.', () => {
    const inputData = JSON.parse(inputDataStr);

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const result = propertyValidator.validateInput(inputData);
    expect(inputData).to.deep.equal(result);
  });

  it('CASE : When processing number value result should return a number instead of a string', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.id = 1077456;

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const result = propertyValidator.validateInput(inputData);
    expect(result)
      .with.property('country')
      .with.property('id')
      .is.a('number')
      .and.equal(1077456);
  });

  it('CASE : When obj has a property with a string value that is too long throw error', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.code = longStr222;

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const func = propertyValidator.validateInput.bind(
      propertyValidator,
      inputData
    );
    expect(func)
      .to.throw()
      .and.has.property('message')
      .contains('Validation error - input.country.code');
  });

  it('CASE : When object.array first item is a string value that is too long throw error', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.languages = [longStr222];

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const func = propertyValidator.validateInput.bind(
      propertyValidator,
      inputData
    );
    expect(func)
      .to.throw()
      .and.has.property('message')
      .contains('Validation error - input.country.languages');
  });

  it('CASE : object containing function throws error', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.languages = () => {};

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const func = propertyValidator.validateInput.bind(
      propertyValidator,
      inputData
    );
    expect(func)
      .to.throw()
      .and.has.property('message')
      .contains('Validation error - input.country.languages');
  });

  it('CASE : object containing incorrect data type throws error', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.languages = new ArrayBuffer();

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const func = propertyValidator.validateInput.bind(
      propertyValidator,
      inputData
    );
    expect(func)
      .to.throw()
      .and.has.property('message')
      .contains('Validation error - input.country.languages');
  });

  it('CASE : object containing unexpected data type throws error', () => {
    const inputData = JSON.parse(inputDataStr);
    inputData.country.languages = /ab+c/;

    const chainValidation = new ChainValidation({maxLength: 200});
    const validationChain = chainValidation.createChain();
    const propertyValidator = new PropertyValidation(
      validationChain,
      'Validation error - input'
    );
    const func = propertyValidator.validateInput.bind(
      propertyValidator,
      inputData
    );
    expect(func)
      .to.throw()
      .and.has.property('message')
      .contains('Validation error - input.country.languages');
  });
});
