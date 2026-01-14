function replaceValueProperty(data) {
  // replace obj property {value} with the value itself.
  return Object.getOwnPropertyNames(data).reduce((acc, prop) => {
    acc[prop] = data[prop]?.value;
    return acc;
  }, {});
}

function addValueProperty(data) {
  // add obj property {value} equal to value.
  return Object.getOwnPropertyNames(data).reduce((acc, prop) => {
    acc[prop] = { value: data[prop] };
    return acc;
  }, {});
}

export { replaceValueProperty, addValueProperty };
