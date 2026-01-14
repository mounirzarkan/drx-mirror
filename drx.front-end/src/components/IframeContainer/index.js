import React from 'react';
import PropTypes from 'prop-types';

const IframeContainer = (props) => {
  const { fields } = props;
  const {url} = fields

  console.log("field: ", fields);

  return (
    <div className="iframe-container">
      <iframe src={url.value} title="Iframe Display" width="100%" height="500px" frameBorder="0" />
    </div>
  );
};

IframeContainer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default IframeContainer;
