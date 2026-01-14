import React from 'react';
import {
  DateInput,
  TextInput,
  IconClickable,
} from '@cochlear-design-system/foundation';
import EditPhoneNumbers from '../ListView/EditPhoneNumbers';

function renderTextField(
  labels,
  label,
  placeholder,
  hint,
  apifield,
  data,
  setFocus,
  touched,
  errors,
  handleChange,
  handleBlur,
  values,
) {
  const isError = !!(touched[apifield] && errors[apifield]);
  return (
    <TextInput
      data-nw-error-field={(isError && apifield) || undefined}
      data-nw-text-input={apifield}
      label={labels[label]}
      name={apifield}
      promptText={labels[placeholder]}
      setFocus={setFocus}
      error={isError}
      errorMsg={errors[apifield]}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[apifield]}
    />
  );
}

function renderDateTimeField(
  labels,
  label,
  placeholder,
  format,
  hint,
  apifield,
  data,
  setFocus,
  touched,
  errors,
  handleChange,
  handleBlur,
  // values,
) {
  const dateValues = data[apifield]?.value
    ? data[apifield]?.value.split('-')
    : [];

  // format is received as a string value ie 'dmy' and is depended on the order of characters.
  const errorFields = [];
  const formatFields = [];
  const fields = format.split('').map(character => {
    if (character === 'd') {
      if (errors.day != null) errorFields.push('day');
      formatFields.push('dd');
      return {
        error: errors.day != null,
        errorMsg: errors.day,
        id: 'day',
        label: labels['labels.af.fields.date.dayLabel'], // 'DD'
        maxLength: 2,
        name: 'day',
        value: dateValues[2],
        pattern: '^[0-9]{2}$',
        size: 2,
      };
    }
    if (character === 'm') {
      if (errors.month != null) errorFields.push('month');
      formatFields.push('mm');
      return {
        error: errors.month != null,
        errorMsg: errors.month,
        id: 'month',
        label: labels['labels.af.fields.date.monthLabel'], // 'MM'
        maxLength: 2,
        name: 'month',
        value: dateValues[1],
        pattern: '^[0-9]{2}$',
        size: 2,
      };
    }
    if (character === 'y') {
      if (errors.year != null) errorFields.push('year');
      formatFields.push('yyyy');
      return {
        error: errors.year != null,
        errorMsg: errors.year,
        id: 'year',
        label: labels['labels.af.fields.date.yearLabel'], // 'YYYY'
        maxLength: 4,
        name: 'year',
        value: dateValues[0],
        pattern: '^[0-9]{4}$',
        size: 4,
      };
    }
    return {};
  });

  // show error for date of birth if it is erronous
  const dateFieldsErronous =
    Boolean(errors.year) ||
    Boolean(errors.month) ||
    Boolean(errors.day);

  const setFocusString =
    setFocus && fields.length > 0 ? fields[0].id : undefined;
  const isAllFieldsError = !!(
    !dateFieldsErronous && errors[apifield]
  );
  return (
    <DateInput
      data-nw-date-format={formatFields.join('-')}
      data-nw-error-field={
        (isAllFieldsError && apifield) ||
        (errorFields.length > 0 && errorFields.join('-')) ||
        undefined
      }
      data-nw-date-input={apifield}
      onChange={handleChange}
      onBlur={handleBlur}
      error={isAllFieldsError}
      errorMsg={errors[apifield]}
      fields={fields}
      hint={labels[hint]}
      inputMode="numeric"
      label={labels[label]}
      name={apifield}
      setFocus={setFocusString}
      isStrict
    />
  );
}

function renderPhoneNumberList(
  labels,
  config,
  numbers,
  disabled,
  touched,
  errors,
  values,
  isValid,
  handleBlur,
  handleChange,
  handleRemove,
  handleReplace,
  handleAdd,
) {
  return (
    <div>
      <EditPhoneNumbers
        config={config}
        numbers={numbers}
        disabled={disabled}
        touched={touched}
        errors={errors}
        focusName={config?.focusName}
        handleBlur={handleBlur}
        handleChange={handleChange}
        onRemove={handleRemove}
        onReplace={handleReplace}
      />

      <div className="ccl__list-edit-mode__form__add">
        <IconClickable
          clkContainerCssModifier="circle-text"
          handleClick={handleAdd}
          id="Add"
          lblContainerCssModifier="space-around"
          link={null}
          rightIcon={{
            color: isValid ? 'interactive' : 'disabled',
            disabled: !isValid,
            size: 'sm',
            type: 'add',
          }}
          text={
            labels['labels.af.contact.edit.phoneNumber.addNewNumber']
          }
          length={values[Object.keys(values)[0]].length}
          disabled={!isValid}
          maxLength={5}
        />
      </div>
    </div>
  );
}

export function renderEditElement(
  data,
  labels,
  elementConfig,
  focusName,
  touched,
  errors,
  handleChange,
  handleBlur,
  values,
) {
  const { label, type, apifield, placeholder, dateFormat, hint } =
    elementConfig;

  switch (type.toLowerCase()) {
    case 'textfield':
      return renderTextField(
        labels,
        label,
        placeholder,
        hint,
        apifield,
        data,
        focusName === apifield,
        touched,
        errors,
        handleChange,
        handleBlur,
        values,
      );
    case 'datetime':
      return renderDateTimeField(
        labels,
        label,
        placeholder,
        dateFormat,
        hint,
        apifield,
        data,
        focusName === apifield,
        touched,
        errors,
        handleChange,
        handleBlur,
        // values,
      );
    default:
      return undefined;
  }
}

export function renderEditList(
  labels,
  config,
  numbers,
  disabled,
  touched,
  errors,
  values,
  isValid,
  handleBlur,
  handleChange,
  handleRemove,
  handleReplace,
  handleAdd,
) {
  // renders phone numbers only
  if (
    config.elements.length === 1 &&
    config.elements[0].type === 'phonenumber'
  )
    return renderPhoneNumberList(
      labels,
      config,
      numbers,
      disabled,
      touched,
      errors,
      values,
      isValid,
      handleBlur,
      handleChange,
      handleRemove,
      handleReplace,
      handleAdd,
    );
  return <div>no match </div>;

  // TODO : render generic fields
}
