/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ReadMode,
  FormattedComposite,
  IconClickable,
  IconLabel,
} from '@cochlear-design-system/foundation';

import useHash from '../../../utils/useHash';

function renderErrorComposite(
  data,
  onErrorHandle,
  errorLinkTo,
  clkErrorLabel,
  errorLabel,
) {
  const onErrorClick = () => {
    onErrorHandle(data);
  };
  const labelCssClass = onErrorHandle ? 'error-interactive' : 'error';

  if (onErrorHandle && data) {
    return (
      <IconClickable
        handleClick={onErrorClick}
        id="Error"
        lblContainerCssModifier="inline"
        clkContainerCssModifier="error"
        leftIcon={{
          color: 'error',
          size: 'sm',
          type: 'error',
        }}
        link={errorLinkTo}
        // link={{
        //   to: errorLinkTo,
        // }}
        text={clkErrorLabel}
        labelCssClass={labelCssClass}
      />
    );
  }
  return (
    <IconLabel
      id="Error"
      lblContainerCssModifier="inline"
      leftIcon={{
        color: 'error',
        size: 'sm',
        type: 'error',
      }}
      text={errorLabel}
    />
  );
}

const ReadModeComposite = props => {
  const {
    id,
    errorLinkTo,
    value,
    validators,
    onErrorHandle,
    clkErrorLabel,
    errorLabel,
    title,
    data,
    isInlineError,
    missingTag,
    ...otherProps
  } = props;
  const formatHash = useHash(value || '');
  const detail =
    missingTag && !isInlineError ? (
      <div className="ccl-e-read-mode-composite__element__error">
        {renderErrorComposite(
          missingTag,
          onErrorHandle,
          errorLinkTo,
          clkErrorLabel,
          errorLabel,
        )}
      </div>
    ) : (
      <FormattedComposite
        data-nw-rmc-format={formatHash}
        data-nw-rmc-value={id}
        config={{ format: value, type: 'composite' }}
        data={data}
      />
    );

  return (
    <div
      {...otherProps}
      className="ccl-e-read-mode-composite__element"
    >
      <ReadMode
        data-nw-rmc-label={id}
        details={[detail]}
        title={title}
      />
      {missingTag && isInlineError ? (
        <div className="ccl-e-read-mode-composite__element__error">
          {renderErrorComposite(
            missingTag,
            onErrorHandle,
            errorLinkTo,
            clkErrorLabel,
            errorLabel,
          )}
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};

export default ReadModeComposite;

ReadModeComposite.propTypes = {
  /**
    Identifier - value for 'data-nw-' data attribute.
  */
  id: PropTypes.string,
  /**
    Clickable router link. 
  */
  errorLinkTo: PropTypes.shape({
    to: PropTypes.string,
  }),
  /**
    value - format value for FormattedComposite.
  */
  value: PropTypes.string,
  /**
    validators - validate data references used by mustache tags.
  */
  validators: PropTypes.array,
  /**
    onErrorHandle - callback used on error message click. If null will display non-clickable error message.
  */
  onErrorHandle: PropTypes.func,
  /**
    clkErrorLabel - label for clickable error message.
  */
  clkErrorLabel: PropTypes.string,
  /**
    errorLabel - label for non-clickable error message.
  */
  errorLabel: PropTypes.string,
  /**
    title - title of the element.
  */
  title: PropTypes.string,
  /**
    data - data source referenced by mustache format tags.
  */
  data: PropTypes.object,
  /**
    isInlineError - display content as well as error message.
  */
  isInlineError: PropTypes.bool,
  /**
    missingTag - missing validation id.
  */
  missingTag: PropTypes.string,
};

ReadModeComposite.defaultProps = {
  id: '',
  errorLinkTo: null,
  value: '',
  validators: [],
  onErrorHandle: undefined,
  clkErrorLabel: '',
  errorLabel: '',
  title: '',
  data: {},
  isInlineError: false,
  missingTag: undefined,
};
