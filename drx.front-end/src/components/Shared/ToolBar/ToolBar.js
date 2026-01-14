import React from 'react';
import PropTypes from 'prop-types';

import {
  Breadcrumb,
  IconClickable,
} from '@cochlear-design-system/foundation';

function toolItem(type, text, link, onHandle, routerLink) {
  const config = {
    clkContainerCssModifier: 'tool-bar',
    lblContainerCssModifier: 'mobile-hidden',
  };
  switch (type.toLowerCase()) {
    case 'printer': {
      return (
        <IconClickable
          id="Print"
          config={config}
          handleClick={onHandle}
          rightIcon={{
            color: 'interactive',
            size: 'sm',
            type: 'print',
          }}
          link={null}
          text={text}
          routerLink={routerLink}
        />
      );
    }
    case 'chevron-left': {
      return (
        <IconClickable
          id="Prev"
          config={config}
          handleClick={onHandle}
          leftIcon={{
            color: 'interactive',
            size: 'sm',
            type: 'chevron-left',
          }}
          link={link}
          text={text}
          routerLink={routerLink}
        />
      );
    }
    case 'chevron-right': {
      return (
        <IconClickable
          id="Next"
          config={config}
          handleClick={onHandle}
          link={link}
          rightIcon={{
            color: 'interactive',
            size: 'sm',
            type: 'chevron-right',
          }}
          text={text}
          routerLink={routerLink}
        />
      );
    }
    default: {
      return undefined;
    }
  }
}

function ToolBar(props) {
  const {
    backHandle,
    backLinkTo,
    backText,
    currentText,
    items,
    routerLink,
  } = props;

  const renderChildren = items.map(
    ({ type, text, linkTo, onHandle }) => {
      return (
        <li
          key={`tool-bar__item__${type}__${text}`}
          className="ccl-e-tool-bar__item ccl-e-tool-bar__item--confine"
        >
          {toolItem(
            type,
            text,
            (linkTo && { to: linkTo }) || null,
            onHandle,
            routerLink,
          )}
        </li>
      );
    },
  );
  const breadcrumbItems = [];
  if (backText) {
    breadcrumbItems.push({
      id: 'order-list',
      linkTo: backLinkTo,
      text: backText,
      handleClick: backHandle,
    });
  }
  if (currentText) {
    breadcrumbItems.push({
      id: 'order-details',
      linkTo: null,
      text: currentText,
    });
  }

  return (
    <ul className="ccl-e-tool-bar">
      <li
        key="tool-bar__item__breadcrumb"
        className="ccl-e-tool-bar__item ccl-e-tool-bar__item--grow"
      >
        <Breadcrumb items={breadcrumbItems} routerLink={routerLink} />
      </li>
      <>{renderChildren}</>
    </ul>
  );
}
export default ToolBar;

ToolBar.propTypes = {
  /**
    Back - Clickable action
  */
  backHandle: PropTypes.func,
  /**
    Back - Router linkTo action
  */
  backLinkTo: PropTypes.string,
  /**
    Previous view - Displayed text. Example: Orders
  */
  backText: PropTypes.string,
  /**
    Current view - Displayed text. Example: Order: #US000123456
  */
  currentText: PropTypes.string,
  /**
    Bar clickable items.
      type: icon type, examples: printer,chevron-right,chevron-left.
      linkTo: router to link, example: /orders?userid=111&accountid=222
      text: displayed text, example: Print.
      onHandle: clickable callback action.
      disable: item disabled state, example: true
  */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      text: PropTypes.string,
      linkTo: PropTypes.string,
      onHandle: PropTypes.func,
      disable: PropTypes.bool,
    }),
  ),
  routerLink: PropTypes.elementType,
};

ToolBar.defaultProps = {
  backHandle: () => {},
  backLinkTo: null,
  backText: null,
  currentText: null,
  items: [],
  routerLink: null,
};
