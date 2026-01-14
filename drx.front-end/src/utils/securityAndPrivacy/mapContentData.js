import _ from 'lodash';
import { getHtmlAttributes } from './../../utils/_helpers/html';
// given data from api layout render, return it in desired form
export function mapContentData(data, name) {
  const mappedData = data[name][0].children.map(x => {
    return {
      id: _.camelCase(x.name),
      name: x.name,
      title: x.title?.value,
      // only add for confirmation screen
      ...(_.camelCase(x.name) === 'confirmationSection' && {
        bodyPassword: x.bodyPassword?.value,
      }),
      // only add for confirmation screen
      ...(_.camelCase(x.name) === 'confirmationSection' && {
        bodyLoginEmail: x.bodyLoginEmail?.value,
      }),
      body: x.body?.value,
      subtitle: x.subtitle?.value,
      button: getHtmlAttributes(x.button?.value, 'link', [
        'url',
        'text',
        'target',
        'variant',
      ]),
      hide: x.hide.boolValue,
    };
  });
  return { sections: mappedData };
}
