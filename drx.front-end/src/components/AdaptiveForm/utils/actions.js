import {
  checkRequired,
  checkMask,
  checkIsValidDateTime,
  checkIsFutureDate,
  checkIsPastDate,
  checkIsValidPostCode,
  checkIsValidPhoneNumber,
} from './Validator';
import buildModel from './submissionModelBuilder';
// import { each } from 'lodash-es';

function onValidateForm(values, fields, labels) {
  const errors = {};

  fields.forEach(element => {
    const { validators, apifield } = element;

    if (validators.length === 0) return false;

    if (!errors[apifield])
      checkRequired(element, values, errors, labels);

    if (!errors[apifield]) checkMask(element, values, errors, labels);

    if (!errors[apifield])
      checkIsValidDateTime(element, values, errors, labels);

    if (!errors[apifield])
      checkIsFutureDate(element, values, errors, labels);

    if (!errors[apifield])
      checkIsPastDate(element, values, errors, labels);

    if (!errors[apifield])
      checkIsValidPostCode(element, values, errors, labels);

    if (!errors[apifield])
      checkIsValidPhoneNumber(element, values, errors, labels);
  });

  return errors;
}

function onValidateList(values, fields, labels) {
  const key = Object.keys(values)[0];

  const errors = {
    [key]: [],
  };

  values[key].forEach((n, index) => {
    const obj = onValidateForm(n, fields, labels);
    errors[key][index] = !Object.values(obj).some(v => v)
      ? undefined
      : obj;
  });

  // if it contains nothing but null values
  if (!errors.numbers.some(el => !!el)) return false;

  return errors;
}

export function onValidate(values, fields, labels, formType) {
  if (formType === 'List') {
    return onValidateList(values, fields, labels);
  }
  return onValidateForm(values, fields, labels);
}

export async function onSave(data, modelName, initial) {
  const submissionModel = await buildModel(data, modelName, initial);
  return submissionModel;
}
