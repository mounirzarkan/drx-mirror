import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { convertGeoFormatToRegex } from '../../../utils/_helpers/regex';

// import parseMax from 'libphonenumber-js/max'
const stringToRegex = str => {
  // Main regex
  const main = str.match(/\/(.+)\/.*/)[1];

  // Regex options
  const options = str.match(/\/.+\/(.*)/)[1];

  // Compiled regex
  return new RegExp(main, options);
};

export function checkRequiredText(
  element,
  validator,
  values,
  errors,
  labels,
) {
  if (validator) {
    const enteredValue =
      values[element.apifield] && values[element.apifield].trim();
    if (!enteredValue) {
      errors[element.apifield] = labels[validator[0]?.message];
    }
  }
}

export function checkRequiredDateTime(
  element,
  validator,
  values,
  errors,
  labels,
) {
  if (validator) {
    if (!values.day && !values.month && !values.year) {
      errors[element.apifield] =
        labels['labels.af.fields.date.validation.required'];
    } else {
      if (!values.day) {
        errors.day =
          labels['labels.af.fields.date.day.validation.required'];
      }

      if (!values.month) {
        errors.month =
          labels['labels.af.fields.date.month.validation.required'];
      }

      if (!values.year) {
        errors.year =
          labels['labels.af.fields.date.year.validation.required'];
      }
    }
  }
}

export function checkRequired(element, values, errors, labels) {
  const validator = element.validators.filter(
    x => x.type === 'predefined' && x.key === 'required',
  );

  if (validator) {
    const { type } = element;

    if (type && type.toLowerCase() === 'datetime') {
      checkRequiredDateTime(
        element,
        validator,
        values,
        errors,
        labels,
      );
    } else {
      checkRequiredText(element, validator, values, errors, labels);
    }
  }
}

export function checkMask(element, values, errors, labels) {
  const validator = element.validators.filter(x => x.type === 'mask');
  if (validator.length > 0) {
    const regex = stringToRegex(validator[0].mask);

    if (!regex.test(values[element.apifield])) {
      errors[element.apifield] = labels[validator[0].message];
    }
  }
}

export function checkIsValidDateTime(
  element,
  values,
  errors,
  labels,
) {
  const { type, apifield } = element;

  if (type?.toLowerCase() === 'datetime') {
    // check valid day (must be less than or equal to 31)
    const { day } = values;
    if (day > 31 && !errors.day) {
      errors.day =
        labels['labels.af.fields.date.day.validation.range'];
    }

    // check valid month (must be less than or equal to 12)
    const { month } = values;
    if (month > 12 && !errors.month) {
      errors.month =
        labels['labels.af.fields.date.month.validation.range'];
    }

    // check valid year (must be greater than 1800)
    const { year } = values;
    if (year < 1800 && !errors.year) {
      errors.year =
        labels['labels.af.fields.date.year.validation.range'];
    }

    // check full valid date (leap date)
    const date = new Date(values.year, values.month - 1, values.day);

    // All the individual parts have passed testing
    // now test date as a whole

    // eslint-disable-next-line eqeqeq
    const isValidDate = Boolean(+date) && date.getDate() == day;

    if (!isValidDate)
      errors[apifield] =
        labels['labels.af.fields.date.validation.invalid'];
  }
}

export function checkIsFutureDate(element, values, errors, labels) {
  const validator = element.validators.filter(
    x => x.type === 'predefined' && x.key === 'dateIsFuture',
  );

  if (validator.length > 0) {
    const timestamp = Date.parse(
      `${values.month}-${values.day}-${values.year}`,
    );
    const date = new Date(timestamp);
    const today = new Date();

    // date entered needs to be greater than today
    if (!isNaN(timestamp) && date <= today) {
      errors[element.apifield] = labels[validator[0].message];
    }
  }
}

export function checkIsPastDate(element, values, errors, labels) {
  const validator = element.validators.filter(
    x => x.type === 'predefined' && x.key === 'dateIsPast',
  );

  if (validator.length > 0) {
    const timestamp = Date.parse(
      `${values.month}-${values.day}-${values.year}`,
    );
    const date = new Date(timestamp);
    const today = new Date();

    // date entered needs to be less than today
    if (!isNaN(timestamp) && date >= today.setHours(0, 0, 0, 0)) {
      errors[element.apifield] = labels[validator[0].message];
    }
  }
}

export function checkIsValidPostCode(
  element,
  values,
  errors,
  labels,
) {
  const validator = element.validators.filter(
    x => x.type === 'predefined' && x.key === 'postcode',
  );

  if (validator.length > 0) {
    const isValid = (value, maskArray) => {
      // if it's an array, we create a '|' seperated string
      const newMask = convertGeoFormatToRegex(maskArray);
      const regex = stringToRegex(`/${newMask.join('|')}/`);
      return regex.test(value);
    };

    const value = values[element.apifield];
    const postcodeMasks = validator[0].mask.split(',');

    if (!isValid(value, postcodeMasks)) {
      errors[element.apifield] = labels[validator[0].message];
    }
  }
}

export function checkIsValidPhoneNumber(
  element,
  phoneObject,
  errors,
  labels,
) {
  let validator = element.validators.filter(
    x => x.type === 'predefined' && x.key === 'phoneNumber',
  );

  if (validator.length > 0) {
    const isRequiredType = () => {
      return phoneObject.type && phoneObject.type !== '';
    };
    const isRequiredCountry = () => {
      return phoneObject.country && phoneObject.country !== '';
    };
    const isRequiredNumber = () => {
      return (
        phoneObject.nationalNumber &&
        phoneObject.nationalNumber !== ''
      );
    };
    const isValidNumber = () => {
      return (
        phoneObject.nationalNumber &&
        phoneObject.nationalNumber !== '' &&
        phoneObject.country &&
        isPossiblePhoneNumber(
          phoneObject.nationalNumber,
          phoneObject.country,
        )
      );
    };
    if (!isRequiredType()) {
      errors.type =
        labels[
          'labels.af.contact.edit.phoneNumber.numberType.validation.required'
        ];
    }

    if (!isRequiredCountry()) {
      errors.country =
        labels[
          'labels.af.contact.edit.phoneNumber.countrycode.validation.required'
        ];
    }

    if (!isRequiredNumber()) {
      errors.nationalNumber =
        labels[
          'labels.af.contact.edit.phoneNumber.nationalNumber.validation.required'
        ];
    } else if (!isValidNumber()) {
      errors.nationalNumber =
        labels[
          'labels.af.contact.edit.phoneNumber.nationalNumber.validation.invalid'
        ];
    }
  }
}
