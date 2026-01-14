// defaults field to the touchedValue
// returns {apifield:touchedValue}
export function touchedApiFields(elements, touchedValue) {
  return (
    elements?.reduce((acc, elementConfig) => {
      if (elementConfig?.apifield) {
        acc[elementConfig.apifield] = touchedValue;
      }
      return acc;
    }, {}) || {}
  );
}

// defaults fields to the touchedValue
// returns [{apifield:touchedValue},...]
export function touchedArrayApiFields(elements, touchedValue) {
  return (
    elements?.map(elementConfig => {
      if (elementConfig?.apifield) {
        const obj = {};
        obj[elementConfig.apifield] = touchedValue;
        return obj;
      }
      return {};
    }) || []
  );
}
// defaults fields to the touchedValue
// returns [{phoneNumber:touchedValue,country:touchedValue,nationalNumber:touchedValue,type:touchedValue},...]
export function touchedPhoneApiFields(elements, touchedValue) {
  return (
    elements?.map(() => {
      return {
        phoneNumber: touchedValue,
        country: touchedValue,
        nationalNumber: touchedValue,
        type: touchedValue,
      };
    }) || []
  );
}
