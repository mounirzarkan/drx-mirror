import { getHtmlAttributes } from '../_helpers/html';

export const mapErrorConfig = (
  dataItem, // props.fields.data.item
  mode,
  errorStatus,
  handleErrorCallback,
  labels,
) => {
  return {
    codeLabel: labels['labels.error.code.label'],
    errorResponse: errorStatus,
    handleCallback: a => handleErrorCallback(a),
    mode,
    data: {
      list: dataItem.errorModes[0].children
        .filter(x => x.name?.toLowerCase() === 'list')
        .map(x => {
          return {
            image: getHtmlAttributes(x.image?.value, 'image', [
              'src',
              'alt',
              'width',
            ]),
            title: x.title?.value,
            text: x.text?.value,
            buttons: x.buttons?.map(b => {
              return {
                name: b.name,
                variant: b.variant?.value,
                text: labels[b.text?.targetItem?.field?.value],
                icon: b.icon?.value,
                link: b.link?.url,
                action: b.action?.value,
                useCallback: b.useCallback?.boolValue,
              };
            }),
          };
        })[0],
      details: dataItem.errorModes[0].children
        .filter(x => x.name?.toLowerCase() === 'details')
        .map(x => {
          return {
            image: getHtmlAttributes(x.image?.value, 'image', [
              'src',
              'alt',
              'width',
            ]),
            title: x.title?.value,
            text: x.text?.value,
            buttons: x.buttons?.map(b => {
              return {
                name: b.name,
                variant: b.variant?.value,
                text: labels[b.text?.targetItem?.field?.value],
                icon: b.icon?.value,
                link: b.link?.url,
                action: b.action?.value,
                useCallback: b.useCallback?.boolValue,
              };
            }),
          };
        })[0],
    },
  };
};
