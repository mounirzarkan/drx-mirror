const _ = require('lodash');
const utils = require('../util/utils');

class ChainValidation {
  constructor(config) {
    this.config = config;
  }
  // Conditions - START
  // arguments: (input, props)=>{}
  isLastCondition() {
    return true;
  }

  isString(input) {
    return _.isString(input);
  }

  isNumber(input) {
    return _.isNumber(input);
  }

  isNullUndefined(input) {
    return input === null || input === undefined;
  }

  isBoolean(input) {
    return input === true || input === false;
  }

  isArray(input) {
    return Array.isArray(input);
  }

  isPlainObject(input) {
    return _.isPlainObject(input);
  }
  // Condition - END

  // Validator - START
  // arguments: (input, onValidateChildren,props)=>{}
  stringValidator(input) {
    return utils.limitMaxLength(input, this.config.maxLength, false);
  }

  numberValidator(input) {
    return utils.limitMaxLength(input, this.config.maxLength, true);
  }

  booleanValidator(input) {
    return utils.limitMaxLength(input, this.config.maxLength, true);
  }

  nullUndefinedValidator(input) {
    return utils.limitMaxLength(input, this.config.maxLength, true);
  }

  arrayValidator(input, onValidateChildren, props) {
    return input.map((i, index) => {
      // recursive call on children
      // `[${index}]` - Array index, useful for debugging.
      return onValidateChildren(i, `[${index}]`, props);
    });
  }

  plainObjectValidator(input, onValidateChildren, props) {
    const objectNames = Object.getOwnPropertyNames(input);
    return objectNames.reduce((acc, name) => {
      // recursive call on children
      // `.${name}` - Object property, useful for debugging.
      acc[name] = onValidateChildren(input[name], `.${name}`, props);
      return acc;
    }, {});
  }

  unknownPropertyType(input) {
    throw new Error(` Property type not supported - input: ${input}`);
  }
  // Validator - END
  createChain() {
    // validators processed in array order
    return [
      {
        condition: this.isString,
        // returns string
        validator: this.stringValidator.bind(this)
      },
      {
        condition: this.isNumber,
        // returns original type - number
        validator: this.numberValidator.bind(this)
      },
      {
        condition: this.isBoolean,
        // returns original type - boolean
        validator: this.booleanValidator.bind(this)
      },
      {
        condition: this.isNullUndefined,
        // returns original type - null | undefined
        validator: this.nullUndefinedValidator.bind(this)
      },
      {
        condition: this.isArray,
        validator: this.arrayValidator.bind(this)
      },
      {
        condition: this.isPlainObject,
        validator: this.plainObjectValidator.bind(this)
      },
      // if reaches last validator throw error as type not found.
      {
        condition: this.isLastCondition,
        validator: this.unknownPropertyType.bind(this)
      }
    ];
  }
}

module.exports = ChainValidation;
