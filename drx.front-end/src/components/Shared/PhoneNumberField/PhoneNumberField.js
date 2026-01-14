/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import {
  SelectInput,
  CheckboxInput,
  NumberInput,
} from '@cochlear-design-system/foundation';
import getPhoneCodes from './getPhoneCodes';

function isOcSmsEnabled(showOcSms, type) {
  return showOcSms && type === 'Mobile';
}
function PhoneNumberField(props) {
  const { data, config } = props;
  const {
    focusName,
    touched,
    handleBlur = () => {},
    onChange = () => {},
    showOcSms,
    showPreferred,
    disablePreferred,
    phoneTypes,
    smsInformation,
    disabled,
    errors,
    // labels start
    phoneLabel,
    phonePromptText,
    countryLabel,
    countryPromptText,
    nationalNumberLabel,
    preferredLabel,
    ocSmsLabel,
    noOptionsMessage,
    phoneNumberLength,
    useStrictMode,
    // labels end
  } = config;

  const {
    type,
    nationalNumber,
    country,
    isPrimary,
    ocSms = false,
    id,
  } = data;

  // sets default values of inputs and displays extra information when mobile type is set.
  const [defaultTypeValue] = useState(type);
  const [defaultCountry] = useState(country);

  // if adding a new number, set default country to user country
  const isTypeError = !!(touched?.type && errors?.type);
  const isCountryError = !!(touched?.country && errors?.country);
  const isNationalNumberError = !!(
    touched?.nationalNumber && errors?.nationalNumber
  );
  return (
    <div className="ccl-e-phone-number-field">
      <div className="ccl-e-phone-number-field__row">
        <div className="ccl-e-phone-number-field__row__cell-combination">
          <div className="ccl-e-phone-number-field__row__cell-combination__cell">
            <SelectInput
              data-nw-error-field={
                (isTypeError && 'type') || undefined
              }
              disabled={disabled}
              setFocus={focusName === 'type'}
              error={isTypeError}
              errorMsg={errors?.type}
              onChange={(name, value) => {
                onChange(name, value);
              }}
              onBlur={handleBlur}
              dataList={phoneTypes}
              defaultValue={defaultTypeValue}
              label={phoneLabel}
              name="type"
              id={`type-${id}`}
              promptText={phonePromptText}
              noOptionsMessage={noOptionsMessage}
            />
          </div>
          <div className="ccl-e-phone-number-field__row__cell-combination__cell">
            <SelectInput
              data-nw-error-field={
                (isCountryError && 'country') || undefined
              }
              disabled={disabled}
              dataList={getPhoneCodes()}
              defaultValue={defaultCountry}
              setFocus={focusName === 'country'}
              error={isCountryError}
              errorMsg={errors?.country}
              onChange={onChange}
              onBlur={handleBlur}
              flagIcon
              isSearchable
              label={countryLabel}
              name="country"
              id={`country-${id}`}
              promptText={countryPromptText}
              noOptionsMessage={noOptionsMessage}
            />
          </div>
        </div>
        <div className="ccl-e-phone-number-field__row__cell">
          <NumberInput
            data-nw-error-field={
              (isNationalNumberError && 'nationalNumber') || undefined
            }
            disabled={disabled}
            setFocus={focusName === 'nationalNumber'}
            error={isNationalNumberError}
            errorMsg={errors?.nationalNumber}
            onBlur={e => handleBlur(e?.target?.name)}
            label={nationalNumberLabel}
            name="nationalNumber"
            id={`nationalNumber-${id}`}
            onChange={e => {
              return onChange(e?.target?.name, e?.target?.value);
            }}
            value={nationalNumber}
            requiredLength={phoneNumberLength}
            isStrict={useStrictMode}
          />
        </div>
      </div>
      <div className="ccl-e-phone-number-field__row">
        <div className="ccl-e-phone-number-field__row__cell">
          {isOcSmsEnabled(showOcSms, type) ? (
            <div
              className="ccl-e-phone-number-field__row__cell__text"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(smsInformation),
              }}
            />
          ) : (
            undefined
          )}
        </div>
        <div className="ccl-e-phone-number-field__row__cell">
          {showPreferred && type !== 'Fax' ? (
            <CheckboxInput
              disabled={disabled || disablePreferred}
              setFocus={focusName === 'isPrimary'}
              error={touched?.isPrimary && errors?.isPrimary}
              errorMsg={errors?.isPrimary}
              onBlur={handleBlur}
              label={preferredLabel}
              name="isPrimary"
              onChange={e => {
                return onChange(e?.target?.name, e?.target?.checked);
              }}
              checked={isPrimary}
            />
          ) : (
            undefined
          )}
          {isOcSmsEnabled(showOcSms, type) ? (
            <CheckboxInput
              disabled={disabled}
              setFocus={focusName === 'ocSms'}
              error={touched?.ocSms && errors?.ocSms}
              errorMsg={errors?.ocSms}
              onBlur={handleBlur}
              label={ocSmsLabel}
              name="ocSms"
              onChange={e => {
                return onChange(e?.target?.name, e?.target?.checked);
              }}
              checked={!(ocSms === 'Withdrawn' || ocSms === null)} // false when withdrawn or null
            />
          ) : (
            undefined
          )}
        </div>
      </div>
    </div>
  );
}
PhoneNumberField.propTypes = {
  /**
    Data - holds referenced information.
  */
  data: PropTypes.object,
  /**
    config - configuration information
  */
  config: PropTypes.object,
};

PhoneNumberField.defaultProps = {
  data: {},
  config: {},
};

export default PhoneNumberField;
