import React from 'react';
import PropTypes from 'prop-types';
import { IconClickable } from '@cochlear-design-system/foundation';

function DetailActionBar(props) {
  const {
    title,
    buttonText,
    buttonHandle,
    buttonIconType,
    hideButton,
    cssModifier,
    mode,
    id,
    routerLink,
    ...otherProps
  } = props;

  const actionBarClass = cssModifier
    ? `ccl-e-detail-action-bar ccl-e-detail-action-bar--${cssModifier}`
    : 'ccl-e-detail-action-bar';
  return (
    <div
      {...otherProps}
      className={actionBarClass}
      data-nw-state={mode}
    >
      <div className="ccl-e-detail-action-bar__title">
        <span>{title}</span>
      </div>
      <div className="ccl-e-detail-action-bar__action">
        {!hideButton ? (
          <IconClickable
            id={id}
            handleClick={buttonHandle}
            leftIcon={{
              size: 'xs',
              disabled: false,
              type: buttonIconType,
              color: 'interactive',
            }}
            text={buttonText}
            clkContainerCssModifier="details-bar"
            lblContainerCssModifier="inline"
            routerLink={routerLink}
          />
        ) : undefined}
      </div>
    </div>
  );
}

export default DetailActionBar;

DetailActionBar.propTypes = {
  /**
    Identifier - value for clickable'data-nw-action' data attribute.
  */
  id: PropTypes.string,
  /**
    Title - text value.
  */
  title: PropTypes.string,
  /**
    ButtonText - value for button text.
  */
  buttonText: PropTypes.string,
  /**
    ButtonHandle - value for button onClick handle.
  */
  buttonHandle: PropTypes.func,
  /**
    ButtonIconType - value for Icon type, example: 'close','edit'.
  */
  buttonIconType: PropTypes.string,
  /**
    HideButton - toggle to hide button.
  */
  hideButton: PropTypes.bool,
  /**
    CssModifier - container css modifier, example: 'highlight'.
  */
  cssModifier: PropTypes.string,
  /**
    mode - is form in read or edit mode
  */
  mode: PropTypes.string,
  routerLink: PropTypes.elementType,
};

DetailActionBar.defaultProps = {
  id: '',
  title: '',
  buttonText: '',
  buttonHandle: () => {},
  buttonIconType: '',
  hideButton: false,
  cssModifier: null,
  mode: '',
  routerLink: null,
};
