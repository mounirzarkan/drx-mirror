/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import {
  SelectInput,
  TextInput,
} from '@cochlear-design-system/foundation';

const CSVTextInput = props => {
  const {
    name,
    readOnly,
    fields,
    labels,
    onChange,
    onBlur,
    touched,
    error,
    value,
  } = props;
  const isError = !!(touched && error);
  return (
    <TextInput
      readOnly={readOnly}
      name={fields.filter(x => x.id === name)[0].name}
      id={fields.filter(x => x.id === name)[0].id}
      label={labels[fields.filter(x => x.id === name)[0].label]}
      optionalText={
        labels[fields.filter(x => x.id === name)[0].optionalText]
      }
      hint={labels[fields.filter(x => x.id === name)[0].hint]}
      promptText={
        labels[fields.filter(x => x.id === name)[0].promptText]
      }
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      error={isError}
      data-nw-error-field={(isError && name) || undefined}
      errorMsg={error}
    />
  );
};

// Counties list with "County ..." in google address but not in geonames
// which populates the dropdown select list
// -----------------------------------------------------------------------------------------------
function checkAddValueToDropdown(value, countryStates) {
  const checkValue = obj => obj.value === value;
  if (countryStates.some(checkValue)) {
    // value exists in states/county list. It might have "County " at the start
    // and be one of a few that is listed that way
    return countryStates;
  }
  // it doesnt exist, lets try removing County from the start if it starts with 'County'
  const countryStatesCopy = [...countryStates];
  if (value) {
    countryStatesCopy.push({ label: value, value });
    countryStatesCopy.sort((a, b) => a.label.localeCompare(b.label));
  }

  // it doesnt exist, and it doesnt start with County
  return countryStatesCopy;
}

const State = props => {
  const {
    readOnly,
    fields,
    labels,
    onChange,
    onBlur,
    touched,
    error,
    value,
    countryStates,
  } = props;
  const isError = !!(touched && error);
  const countryStatesCopy = checkAddValueToDropdown(
    value,
    countryStates,
  );

  return (
    <SelectInput
      dataList={countryStatesCopy}
      isSearchable
      defaultValue={value}
      disabled={readOnly}
      name={fields.filter(x => x.id === 'state')[0].name}
      id={fields.filter(x => x.id === 'state')[0].name}
      label={labels[fields.filter(x => x.id === 'state')[0].label]}
      optionalText={
        labels[fields.filter(x => x.id === 'state')[0].optionalText]
      }
      hint={labels[fields.filter(x => x.id === 'state')[0].hint]}
      promptText={
        labels[fields.filter(x => x.id === 'state')[0].promptText]
      }
      onChange={onChange}
      onBlur={onBlur}
      error={isError}
      data-nw-error-field={(isError && 'state') || undefined}
      errorMsg={error}
    />
  );
};

const CityStateView = ({
  config,
  labels,
  readOnly,
  onChange,
  onBlur,
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
  countryStates,
}) => {
  const { fields } = config;

  const sharedProps = {
    readOnly,
    fields,
    labels,
  };

  const cityProps = {
    onChange,
    onBlur,
    touched: touched.city,
    error: errors.city,
    value: values.city,
  };

  const postcodeProps = {
    onChange,
    onBlur,
    touched: touched.postcode,
    error: errors.postcode,
    value: values.postcode,
  };

  const stateProps = {
    onChange: setFieldValue,
    onBlur: setFieldTouched,
    touched: touched.state,
    error: errors.state,
    value: values.state,
    countryStates,
  };

  if (config?.cityState === 'Postcode - City - State') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <div className="columns">
          <div className="column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
          <div className="column is-half">
            <CSVTextInput
              name="city"
              {...sharedProps}
              {...cityProps}
            />
          </div>
        </div>
        <State {...sharedProps} {...stateProps} />
      </div>
    );
  }

  if (config?.cityState === 'City - Postcode - State') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <CSVTextInput name="city" {...sharedProps} {...cityProps} />
        <div className="columns">
          <div className="column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
          <div className="column is-half">
            <State {...sharedProps} {...stateProps} />
          </div>
        </div>
      </div>
    );
  }

  if (config?.cityState === 'Postcode - City - State') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <div className="ccl__columns" style={{ marginBottom: '0px' }}>
          <div className="ccl__column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
          <div className="ccl__column is-half">
            <CSVTextInput
              name="city"
              {...sharedProps}
              {...cityProps}
            />
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <State {...sharedProps} {...stateProps} />
        </div>
      </div>
    );
  }

  if (config?.cityState === 'City - State - Postcode') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <CSVTextInput name="city" {...sharedProps} {...cityProps} />
        <div className="columns">
          <div className="column is-half">
            <State {...sharedProps} {...stateProps} />
          </div>
          <div className="column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
        </div>
      </div>
    );
  }

  if (config?.cityState === 'Postcode - City') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <div className="columns">
          <div className="column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
          <div className="column is-half">
            <CSVTextInput
              name="city"
              {...sharedProps}
              {...cityProps}
            />
          </div>
        </div>
      </div>
    );
  }

  if (config?.cityState === 'Postcode - State - City') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <CSVTextInput
          name="postcode"
          {...sharedProps}
          {...postcodeProps}
        />
        <div className="columns">
          <div className="column is-half">
            <State {...sharedProps} {...stateProps} />
          </div>
          <div className="column is-half">
            <CSVTextInput
              name="city"
              {...sharedProps}
              {...cityProps}
            />
          </div>
        </div>
      </div>
    );
  }

  if (config?.cityState === 'City - Postcode') {
    return (
      <div
        className="ccl-c-city-state"
        data-nw-order={config?.cityState.toLowerCase()}
      >
        <CSVTextInput name="city" {...sharedProps} {...cityProps} />
        <div className="columns">
          <div className="column is-half">
            <CSVTextInput
              name="postcode"
              {...sharedProps}
              {...postcodeProps}
            />
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

CityStateView.propTypes = {
  config: PropTypes.shape({
    regionsUrl: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape()),
    cityState: PropTypes.string,
  }).isRequired,
  labels: PropTypes.shape({}).isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  countryStates: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(PropTypes.strings),
      PropTypes.number,
    ]),
  ).isRequired,
};

CSVTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  labels: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.bool,
  touched: PropTypes.bool,
};
CSVTextInput.defaultProps = {
  readOnly: false,
  error: false,
  touched: false,
};

State.propTypes = {
  readOnly: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  labels: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.bool,
  touched: PropTypes.bool,
  countryStates: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(PropTypes.strings),
      PropTypes.number,
    ]),
  ).isRequired,
};
State.defaultProps = {
  readOnly: false,
  error: false,
  touched: false,
};

export default CityStateView;
