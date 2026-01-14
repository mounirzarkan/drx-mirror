/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ReadModeComposite from '../../Shared/ReadModeComposite/ReadModeComposite';
import getMissingTag from './../utils/getMissingTag';
import { replaceValueProperty } from './../utils/convertValueProperties';

const ReadMode = props => {
  const { data, config, labels } = props;

  const {
    elements,
    // fields,
    clkErrorLabel,
    errorLabel,
    onErrorHandle,
    errorLinkTo,
  } = config;

  return elements.map(({ id, label, value: format, validators }) => {
    const element = {
      id,
      value: format,
      validators,
    };
    const transformedData = replaceValueProperty(data);
    const missingTags = getMissingTag(
      format,
      transformedData,
      element,
      {},
    );
    const missingTag =
      (Array.isArray(missingTags) &&
        missingTags.length > 0 &&
        missingTags[0]) ||
      undefined;
    return (
      <div className="ccl__view-read-mode" key={id}>
        <ReadModeComposite
          clkErrorLabel={labels[clkErrorLabel]}
          data={data}
          errorLabel={labels[errorLabel]}
          id={id}
          onErrorHandle={onErrorHandle}
          errorLinkTo={errorLinkTo || null}
          title={labels[label]}
          validators={validators}
          value={format}
          missingTag={missingTag}
        />
      </div>
    );
  });
};

export default ReadMode;

ReadMode.propTypes = {
  /**
    Data - holds information that is referenced by format.
  */
  data: PropTypes.object.isRequired,
  /**
    config - configuration information
  */
  config: PropTypes.object.isRequired,
  /**
    labels - contains label text
  */
  labels: PropTypes.object.isRequired,
};

ReadMode.defaultProps = {
  data: {},
  config: { elements: [] },
  labels: {},
};
