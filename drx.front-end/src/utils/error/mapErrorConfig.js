import { getHtmlAttributes } from '../_helpers/html';

export function mapErrorConfig(
  data,
  mode,
  errorStatus,
  handleErrorCallback,
  labels,
) {
  return {
    codeLabel: labels['labels.error.code.label'],
    errorResponse: errorStatus,
    handleCallback: a => handleErrorCallback(a),
    mode,
    data: {
      submit: data
        .filter(data => data.name.toLowerCase() === 'submit')
        .map(x => {
          return {
            image: getHtmlAttributes(x.image.value, 'image', [
              'src',
              'alt',
              'width',
            ]),
            title: x.title.value,
            text: x.text.value,
            buttons: x.buttons.map(x => {
              return {
                name: x.name,
                variant: x.variant.value,
                text: labels[x.text.targetItem.field.value],
                icon: x.icon.value,
                link: x.link.url,
                action: x.action.value,
                useCallback: x.useCallback.boolValue,
              };
            }),
          };
        })[0],
      read: data
        .filter(data => data.name.toLowerCase() === 'read')
        .map(x => {
          return {
            image: getHtmlAttributes(x.image.value, 'image', [
              'src',
              'alt',
              'width',
            ]),
            title: x.title.value,
            text: x.text.value,
            buttons: x.buttons.map(x => {
              return {
                name: x.name,
                variant: x.variant.value,
                text: labels[x.text.targetItem.field.value],
                icon: x.icon.value,
                link: x.link.url,
                action: x.action.value,
                useCallback: x.useCallback.boolValue,
              };
            }),
          };
        })[0],
    },
  };
}
