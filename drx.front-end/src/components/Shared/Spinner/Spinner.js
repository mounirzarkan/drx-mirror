import React from 'react';
import PropTypes from 'prop-types';

function Spinner(props) {
  const { text } = props;
  return (
    <div className="ccl-e-spinner">
      <div className="ccl-e-spinner__content">
        <div className="ccl-e-spinner__loading" />
        {text}
      </div>
    </div>
  );
}

export default Spinner;

Spinner.propTypes = { text: PropTypes.string };

Spinner.defaultProps = { text: '' };
