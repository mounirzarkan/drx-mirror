import { getHtmlAttributes } from './_helpers/html';

export default function mapErrorConfig(
  props,
  mode,
  errorStaus,
  handleErrorCallback,
  labels,
) {
  return {
    codeLabel: labels['labels.error.code.label'],
    errorResponse: errorStaus,
    handleCallback: a => handleErrorCallback(a),
    mode,
    data: {
      default: props?.fields?.data?.item?.errorModes[0].children
        .filter(x => x.name.toLowerCase() === 'default')
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
