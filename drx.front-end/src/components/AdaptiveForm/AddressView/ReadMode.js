import React from 'react';
import ReadModeComposite from '../../Shared/ReadModeComposite/ReadModeComposite';
import getMissingTag from './../utils/getMissingTag';
import { replaceValueProperty } from './../utils/convertValueProperties';

const AddressReadMode = ({ config, data, labels }) => {
  const address = {
    street1: { value: data?.street1 },
    street2: { value: data?.street2 },
    city: { value: data?.city },
    state: { value: data?.state },
    zipCode: { value: data?.postalCode },
    country: { value: data?.countryName },
  };

  const element = {
    id: 'address',
    value: config.label.format,
    validators: config.label.validators,
  };
  const transformedData = replaceValueProperty(address);
  const missingTags = getMissingTag(
    config.label.format,
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
    <div className="ccl__view-read-mode">
      <ReadModeComposite
        clkErrorLabel={labels['labels.af.personal.read.error.clk']}
        data={address}
        errorLabel={labels['labels.af.personal.read.error.label']}
        id="address"
        onErrorHandle={config.onErrorHandle}
        title={labels['labels.address.read.title']}
        validators={config.label.validators}
        value={config.label.format}
        missingTag={missingTag}
      />
    </div>
  );
};

export default AddressReadMode;
