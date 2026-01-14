import React from 'react';
import { ErrorMessage } from '@cochlear-design-system/foundation';
import { getHtmlAttributes } from '../../utils/_helpers/html';
import placeholder from '../../assets/images/Image_Placeholder.svg';

const Error = ({ fields, routeParams, labels }) => {
  const { item } = fields.data;

  // if an image doesnt exist in SC, use a placeholder image instead
  const placeholderImg = {
    src: placeholder,
    alt: 'Image not found',
    width: '120',
  };

  const imgSrc = item.image?.value;

  const image = imgSrc
    ? getHtmlAttributes(imgSrc, 'image', ['src', 'alt', 'width'])
    : placeholderImg;

  return (
    <ErrorMessage
      data={{
        missing: {
          image,
          buttons: item.buttons.map(x => {
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
          text: item.text.value,
          title: item.title.value,
        },
      }}
      style={{ paddingTop: '1rem' }}
      handleCallback={() => {}}
      mode="missing"
    />
  );
};

export default Error;
