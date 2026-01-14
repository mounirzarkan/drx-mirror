const log = require('../util/logUtil.js');

class PropertyValidation {
  constructor(actionValidator, errorMessage) {
    this.actionValidator = actionValidator;
    this.errorMessage = errorMessage;
  }

  validateInput(input) {
    try {
      return this.validate(input, '', {});
    } catch (err) {
      // log top level message to console.
      this.onError(err, this.errorMessage, true);
    }
  }

  validate(input, errorMessage, props) {
    try {
      const {validator} =
        this.actionValidator.find(({condition}) => {
          return condition(input, props);
        }) || {};
      if (validator) {
        // recursive callback for validating child properties, ie array || object
        const onValidateChildren = this.validate.bind(this);
        return validator(input, onValidateChildren, props);
      }
      throw new Error('No validator found.');
    } catch (err) {
      // recursive throws errors, skip console log until top level.
      this.onError(err, errorMessage, false);
    }
  }

  onError(err, errorMessage, isLogged) {
    // concat thrown error messages
    const messageStack = `${errorMessage}${
      err && err.message ? err.message : err
    }`;
    if (isLogged) {
      // log message.
      log.error(messageStack);
    }
    throw new Error(messageStack);
  }
}
module.exports = PropertyValidation;
