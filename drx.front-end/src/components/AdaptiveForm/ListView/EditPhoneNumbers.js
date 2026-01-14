import React from 'react';
import { IconClickable } from '@cochlear-design-system/foundation';
import PhoneNumberField from '../../Shared/PhoneNumberField/PhoneNumberField';

function getFocusName(focusName, index) {
  // matches index and property from the phone numbers list with the focusName
  // returns the individual name identifier if matched ie 'country' or 'nationalNumber'
  if (focusName === `[${index}].country`) {
    return 'country';
  }
  if (focusName === `[${index}].nationalNumber`) {
    return 'nationalNumber';
  }
  if (focusName === `[${index}].type`) {
    return 'type';
  }
  return focusName;
}

function getPrimaries(numbers) {
  // returns an array where each item contains isPrimary equal to true.
  if (numbers) {
    return numbers.reduce((acc, number, i) => {
      if (number?.isPrimary) {
        // push number and index
        acc.push({ number, i });
      }
      return acc;
    }, []);
  }
  return [];
}

function getOcSms(numbers) {
  // returns an array where each item contains ocSms equal to true.
  if (numbers) {
    return numbers.reduce((acc, number, i) => {
      if (number?.ocSms) {
        // push number and index
        acc.push({ number, i });
      }
      return acc;
    }, []);
  }
  return [];
}

const EditPhoneNumbers = props => {
  const {
    config,
    onRemove,
    onReplace,
    touched,
    errors,
    focusName,
    handleBlur,
    handleChange,
    disabled,
    numbers = [{}],
    routerLink,
  } = props;

  return numbers.map((value, index) => {
    // when only one number, set preferred option to true and disable.
    const disablePreferred = numbers.length === 1;
    if (disablePreferred && !value?.isPrimary) {
      onReplace(0, {
        ...value,
        isPrimary: true,
      });
    }

    // transform target name to Formik list target.
    const transformedHandleBlur = name =>
      handleBlur({
        target: {
          name: `numbers[${index}].${name}`,
        },
      });

    const transformedOnChange = (targetName, targetValue) => {
      // handle isPrimary unique true value.
      if (targetName === 'isPrimary' && targetValue) {
        // get list of items with isPrimary set to true.
        const primaries = getPrimaries(numbers);
        // set primaries to false, as only one should be selected at a time.
        primaries.forEach(({ number, i }) =>
          onReplace(i, {
            ...number,
            isPrimary: false,
          }),
        );
      }

      // handle ocSms unique true value.
      if (targetName === 'ocSms' && targetValue) {
        // get list of items with ocSms set to true.
        const ocSms = getOcSms(numbers);

        // set ocSms to null, as only one should be selected at a time.
        ocSms.forEach(({ number, i }) =>
          onReplace(i, {
            ...number,
            ocSms: null,
          }),
        );
      }

      // if ocSms is true but it is not a mobile, set to default null
      if (
        targetName === 'type' &&
        targetValue !== 'Mobile' &&
        value?.ocSms === true
      ) {
        onReplace(index, {
          ...value,
          ocSms: null,
        });
      }
      // transform target name to Formik list target.
      handleChange({
        target: {
          name: `numbers[${index}].${targetName}`,
          value: targetValue,
        },
      });
    };

    // touched state for particular number.
    const touchedState =
      (touched?.numbers && touched.numbers[index]) || undefined;

    // error state for particular number.
    const errorsState = errors?.numbers && errors.numbers[index];

    // gets property to focus on.
    const focusProperty = getFocusName(focusName, index);

    const phoneNumberConfig = {
      ...config,
      disablePreferred,
      handleBlur: transformedHandleBlur,
      onChange: transformedOnChange,
      touched: touchedState,
      errors: errorsState,
      focusName: focusProperty,
      disabled,
    };

    const handleRemove = () => {
      onRemove(index);
    };
    return (
      <div key={value.id} className="ccl__list-edit-phone-numbers">
        <div className="ccl__list-edit-phone-numbers__phone">
          <PhoneNumberField data={value} config={phoneNumberConfig} />
        </div>
        <div className="ccl__list-edit-phone-numbers__remove">
          <div className="ccl__list-edit-phone-numbers__remove__button">
            {numbers?.length > 1 ? (
              <IconClickable
                clkContainerCssModifier="circle"
                handleClick={handleRemove}
                id="Remove"
                lblContainerCssModifier="inline"
                leftIcon={{
                  color: 'interactive',
                  disabled: false,
                  size: 'sm',
                  type: 'delete',
                }}
                link={null}
                text={null}
                routerLink={routerLink}
              />
            ) : undefined}
          </div>
        </div>
      </div>
    );
  });
};
export default EditPhoneNumbers;
