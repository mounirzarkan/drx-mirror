import React from 'react';
import {
  Text,
  Title,
  Button,
} from '@cochlear-design-system/foundation';

function contentElementBlock({ section, email, handleCallback }) {
  // build the button
  // trigger the sf change username or password email flow
  const type =
    section.id === 'passwordSection'
      ? 'ChangePassword'
      : 'ChangeUserName';

  const btn = section.button.url ? (
    <Button
      icon="chevron-right"
      text={section.button?.text}
      className=""
      variant={section.button?.variant || 'brand-primary'}
      onClick={() => handleCallback({ type })}
    />
  ) : null;

  // login email text block
  const emailSection =
    email && section.id === 'loginEmailSection' ? (
      <div className="ccl__e__content-element-block__text">
        <Text content={section.subtitle} type="body-text-bold" />
        <Text content={email} />
      </div>
    ) : null;

  return (
    <div className="ccl__e__content-element-block">
      <div className="ccl__e__content-element-block__title">
        <Title
          content={section.title}
          size="heading-3"
          tag="h2"
          border
          style={{ marginBottom: '1em' }}
        />
      </div>
      <div className="ccl__e__content-element-block__text">
        <Text content={section.body} isHTML />
      </div>

      {emailSection}

      <div className="ccl__e__content-element-block__button">
        {btn}
      </div>
    </div>
  );
}

export default contentElementBlock;
