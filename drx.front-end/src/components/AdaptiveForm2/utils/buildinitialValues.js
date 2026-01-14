export default function buildinitialValues(elements, data) {
  const obj = {};

  elements.forEach(element => {
    const { type, apifield } = element;

    if (type.toLowerCase() !== 'datetime') {
      obj[apifield] = data[apifield]?.value;
    }

    if (type.toLowerCase() === 'datetime') {
      if (data[apifield]?.value) {
        const date = new Date(data[apifield].value);

        obj['day'] = date.getDate();
        obj['month'] = date.getMonth() + 1;
        obj['year'] = date.getFullYear();
      } else {
        obj['day'] = undefined;
        obj['month'] = undefined;
        obj['year'] = undefined;
      }
    }
    // if (element.type === 'something') {
    //   obj['x'] = date.getDate();
    //   obj['y'] = date.getMonth() + 1;
    //   obj['z'] = date.getFullYear();
    // }
  });

  return obj;
}
