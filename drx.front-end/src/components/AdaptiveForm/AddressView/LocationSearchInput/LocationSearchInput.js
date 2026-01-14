/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import PlacesAutocomplete, {
  geocodeByPlaceId,
} from 'react-places-autocomplete';
import { Icon } from '@cochlear-design-system/foundation';
const LocationSearchInput = ({
  mapToField,
  address,
  updateAddress,
  enableForm,
  searchCharLength,
  name,
  optionalText,
  hint,
  promptText,
  promptMobile,
  country,
  label,
  loadingText,
  types,
  addressNotFound,
  formik,
  error,
  setFocus,
  addressAPIState,
  ...props
}) => {
  const [addressText, setAddressText] = useState('');

  const {
    addressAPIStateTypeId = 'administrative_area_level_1', // set default
    addressAPIStateName = 'short_name', // set default
  } = addressAPIState;

  const manualEntryString = `${addressNotFound.text} <span>${addressNotFound.button}</span>`;

  const handleChange = addr => {
    if (addr === manualEntryString) {
      setAddressText('');
      return false;
    }

    setAddressText(addr);
  };

  // if name and/or number arent returned from the api, they are already set to an empty string
  const formatStreet = (number, name, country) => {
    const countryCode = country.toLowerCase();
    let street = '';
    // only add blank space if needed
    const blankSpace = number !== '' && name !== '' ? ' ' : '';

    switch (countryCode) {
      case 'it':
        street = `${name}${blankSpace}${number}`;
        break;
      default:
        street = `${number}${blankSpace}${name}`;
    }
    return street;
  };

  const formatJP = (
    addressComponents = [],
    city = '',
    postcode = '',
  ) => {
    if (addressComponents.length > 0 && city) {
      // map through each item of the addressComponents until we reach the city value
      // get index of city value
      const cityIndex = addressComponents.findIndex(
        ({ long_name }) => long_name === city,
      );

      if (cityIndex !== -1) {
        // now we have a new array of only street values, maybe a postcode, so we have to do another test
        let n = addressComponents.slice(0, cityIndex);

        // some street addresses also return a postcode
        // lets see if that also exists
        // get index of postcode value and remove it from array
        const postCodeIndex = n.findIndex(
          ({ long_name }) => long_name === postcode,
        );

        if (postCodeIndex !== -1) n.splice(postCodeIndex, 1);

        // when/if you hit a “premise” add a hyphen
        // if not complete, and there is another “premise” add a space
        let streetName = '';
        let counter = 0;
        n.toReversed().map(item => {
          if (item.types.includes('premise')) {
            if (counter === 0)
              streetName =
                streetName !== ''
                  ? `${streetName}-${item.long_name}`
                  : `${item.long_name}`;
            else streetName = `${streetName} ${item.long_name}`;
            counter++;
          } else {
            streetName = `${streetName}${item.long_name}`;
          }
        });

        return streetName;
      }
      // city not found in array
      return '';
    }
    // array is empty or city name is empty
    return '';
  };

  const formatKR = (
    addressComponents = [],
    city = '',
    postcode = '',
  ) => {
    if (addressComponents.length > 0 && city) {
      // map through each item of the addressComponents until we reach the city value
      // get index of city value
      const cityIndex = addressComponents.findIndex(
        ({ long_name }) => long_name === city,
      );

      if (cityIndex !== -1) {
        // now we have a new array of only street values, maybe a postcode, so we have to do another test
        let n = addressComponents.slice(0, cityIndex);

        // some street addresses also return a postcode
        // lets see if that also exists
        // get index of postcode value and remove it from array
        const postCodeIndex = n.findIndex(
          ({ long_name }) => long_name === postcode,
        );

        if (postCodeIndex !== -1) n.splice(postCodeIndex, 1);

        // when/if you hit a “premise” add a hyphen
        // if not complete, and there is another “premise” add a space
        let streetName = '';
        let counter = 0;
        n.toReversed().map(item => {
          if (item.types.includes('premise')) {
            if (counter === 0)
              streetName =
                streetName !== ''
                  ? `${streetName} ${item.long_name}`
                  : `${item.long_name}`;
            else streetName = `${streetName} ${item.long_name}`;
            counter++;
          } else {
            streetName = `${streetName} ${item.long_name}`;
          }
        });

        return streetName;
      }
      // city not found in array
      return '';
    }
    // array is empty or city name is empty
    return '';
  };

  useEffect(() => {
    if (mapToField === 'city') setAddressText(address.city);
    // eslint-disable-next-line
  }, [address.city]);

  const handleSelect = async (addr, placeId) => {
    if (addr === manualEntryString) {
      enableForm();
      setAddressText('');
      return false;
    }
    const ls = await geocodeByPlaceId(placeId);
    const x = ls[0];

    const countryCode = country.toLowerCase();

    let streetNumberSelector = '';
    let streetNumber = '';
    let streetNameSelector = '';
    let streetName = '';

    let addressComponents = [];

    if (countryCode === 'jp' || countryCode === 'kr') {
      addressComponents = x.address_components;
    } else {
      streetNumberSelector = x.address_components.filter(y =>
        y.types.includes('street_number'),
      );

      streetNumber =
        streetNumberSelector.length > 0
          ? streetNumberSelector[0].long_name
          : '';

      streetNameSelector = x.address_components.filter(y =>
        y.types.includes('route'),
      );

      streetName =
        streetNameSelector.length > 0
          ? streetNameSelector[0].long_name
          : '';
    }

    let city = '';
    const cityLocalitySelector = x.address_components.filter(y =>
      y.types.includes('locality'),
    );
    const cityAdminLvl1Selector = x.address_components.filter(y =>
      y.types.includes('administrative_area_level_1'),
    );
    const citySublocalitySelector = x.address_components.filter(y =>
      y.types.includes('sublocality'),
    );

    const citySublocalityLvl1Selector = x.address_components.filter(
      y => y.types.includes('sublocality_level_1'),
    );
    const citySublocalityLvl4Selector = x.address_components.filter(
      y => y.types.includes('sublocality_level_4'),
    );

    const cityPostalTownSelector = x.address_components.filter(y =>
      y.types.includes('postal_town'),
    );
    const cityNeighborhoodSelector = x.address_components.filter(y =>
      y.types.includes('neighborhood'),
    );

    if (countryCode !== 'kr') {
      if (cityLocalitySelector.length > 0) {
        city = cityLocalitySelector[0].long_name;
      } else if (citySublocalitySelector.length > 0) {
        city = citySublocalitySelector[0].long_name;
      } else if (cityPostalTownSelector.length > 0) {
        city = cityPostalTownSelector[0].long_name;
      } else if (cityNeighborhoodSelector.length > 0) {
        city = cityNeighborhoodSelector[0].long_name;
      }
    } else {
      if (
        cityLocalitySelector.length > 0 &&
        cityAdminLvl1Selector.length > 0 &&
        (citySublocalityLvl1Selector.length <= 0 ||
          citySublocalityLvl4Selector.length <= 0)
      ) {
        city = cityAdminLvl1Selector[0].long_name;
      } else if (cityLocalitySelector.length > 0) {
        city = cityLocalitySelector[0].long_name;
      } else if (cityAdminLvl1Selector.length > 0) {
        city = cityAdminLvl1Selector[0].long_name;
      } else if (citySublocalitySelector.length > 0) {
        city = citySublocalitySelector[0].long_name;
      } else if (cityPostalTownSelector.length > 0) {
        city = cityPostalTownSelector[0].long_name;
      } else if (cityNeighborhoodSelector.length > 0) {
        city = cityNeighborhoodSelector[0].long_name;
      }
    }

    const stateSelector = x.address_components.filter(
      y => y.types.includes(addressAPIStateTypeId || undefined), // default to 'administrative_area_level_1'
    );

    const state =
      stateSelector.length > 0
        ? stateSelector[0][addressAPIStateName || undefined] // defaults to 'short_name'
        : '';

    const postcodeSelector = x.address_components.filter(y =>
      y.types.includes('postal_code'),
    );

    const postcode =
      postcodeSelector.length > 0
        ? postcodeSelector[0].long_name
        : '';

    // console.log('incoming from Google', x);

    // how to display street 1
    const getStreet1 = countryCode => {
      switch (countryCode) {
        case 'jp':
          return formatJP(addressComponents, city, postcode);

        case 'kr':
          return formatKR(addressComponents, city, postcode);

        default:
          return formatStreet(streetNumber, streetName, country);
      }
    };
    const street1 = getStreet1(countryCode);

    updateAddress(
      {
        ...address,
        street1,
        street2: '',
        city,
        state,
        postcode,
      },
      formik,
    );

    setAddressText(addr);
  };

  const searchOptions = {
    types,
    componentRestrictions: { country },
  };

  // const [hideTypeahead, setHideTypeahead] = useState(false);
  const chars = searchCharLength - 2;
  // Log error status and clear dropdown when Google Maps API returns an error.
  const onError = (status, clearSuggestions) => {
    // console.log(
    //   'Google Maps API returned error with status: ',
    //   status,
    // );
    clearSuggestions();
    enableForm();
  };

  // placeholder text shown on the typeahead.
  // We have a shortened value if viewed on mobile
  const prompt = window.matchMedia('(min-width: 768px)').matches
    ? promptText
    : promptMobile;

  function addEnableListButton(suggestions) {
    if (suggestions.length > 0) {
      if (
        suggestions[suggestions.length - 1].placeId !==
        'address-not-found'
      ) {
        suggestions.push({
          id: undefined,
          description: manualEntryString,
          placeId: 'address-not-found',
          index: suggestions.length,
          active: false,
        });

        return suggestions;
      }
    }
    return null;
  }

  const SuggestionsList = ({
    getInputProps,
    getSuggestionItemProps,
    suggestions,
    loading,
  }) => {
    // add custom list option
    addEnableListButton(suggestions);

    const cssComponentClass = 'ccl__form-input';
    const cssTextClass = 'ccl__text';

    // if (hideTypeahead) {
    //   return null;
    // }
    const formInputErrorCss = error
      ? `${cssComponentClass}--has-error`
      : '';

    const isError = !!error;
    return (
      <div {...props}>
        <div
          className={`ccl__form-input ccl__form-input__typeahead ${formInputErrorCss}`}
          data-nw-error-field={(isError && name) || undefined}
        >
          <label
            className={`${cssComponentClass}__label ${cssTextClass} ${cssTextClass}--body-text-bold ${
              label ? '' : 'is-sr-only' // if there isnt a label, apply the sr only class
            }`}
            htmlFor={name}
          >
            {label || prompt}
            {optionalText && (
              <span
                className={`${cssComponentClass}__label__optional ${cssTextClass} ${cssTextClass}--small-body-text-italic`}
              >
                {`(${optionalText})`}
              </span>
            )}
          </label>

          {hint && (
            <p
              className={`${cssComponentClass}__hint ${cssTextClass} ${cssTextClass}--informative-text`}
            >
              {hint}
            </p>
          )}

          <div
            className={`ccl__field-control ccl__field-control--has-icon`}
          >
            <input
              key={isError}
              {...getInputProps({
                placeholder: prompt,
                className:
                  'location-search-input ccl__field-control__input ccl__text ccl__text--body-text',
              })}
              id={name}
              autoFocus={setFocus}
            />

            <Icon
              type="expand-more"
              color={isError ? 'error' : 'disabled'}
            />
          </div>

          {error && (
            <p
              className={`ccl__form-input__error-message ccl__text ccl__text--error-small-text`}
            >
              {error}
            </p>
          )}

          {suggestions.length > 0 && (
            <div
              aria-live="polite"
              className="address__typeahead"
              data-nw-addresslookup
            >
              <ul className="address__list">
                {loading && (
                  <li className="address__list__item">
                    <span className="address__list__item__button">
                      {loadingText}
                    </span>
                  </li>
                )}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'address__list__item address__list__item--active '
                    : 'address__list__item';
                  return (
                    <li
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                      key={suggestion.placeId}
                    >
                      <button
                        type="button"
                        className="address__list__item__button"
                        data-nw-addresslookup-option={
                          suggestion.placeId
                        }
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            suggestion.description,
                          ),
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <PlacesAutocomplete
        value={addressText}
        searchOptions={searchOptions}
        onChange={handleChange}
        shouldFetchSuggestions={addressText.length > chars}
        onSelect={handleSelect}
        onError={onError}
      >
        {SuggestionsList}
      </PlacesAutocomplete>
    </>
  );
};

export default LocationSearchInput;

LocationSearchInput.propTypes = {
  /**
   * What name to use on the text input, eg addressLookup, etc.
   */
  name: PropTypes.string,
  /**
   * Country to restrict search results to
   */
  country: PropTypes.string.isRequired,
  /**
   * Only fetch suggestions when the input text is longer than this amount of characters.
   */
  searchCharLength: PropTypes.number,
  /**
   * What field label to use
   */
  label: PropTypes.string,
  /**
   * What promptText value to use on empty inputs
   */
  promptText: PropTypes.string,
  /**
   * Mobile variation use on empty inputs
   */
  promptMobile: PropTypes.string,
  /**
   * Do you want to display hint text? Add it here. Eg, for a date of birth field you may want to add some information regarding the format: Format is month, day, year, eg. 02 12 1982
   */
  hint: PropTypes.string,
  /**
   * Inform the user that the field is not required. Enter 'optional' text label here.
   */
  optionalText: PropTypes.string,
  /**
   * If a request is pending, show this text is the suggestions list
   */
  loadingText: PropTypes.string,
  address: PropTypes.objectOf(PropTypes.string),
  enableForm: PropTypes.func,
  updateAddress: PropTypes.func,
  mapToField: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string),
  addressNotFound: PropTypes.objectOf(PropTypes.string),
  error: PropTypes.object,
  setFocus: PropTypes.bool,
  addressAPIState: PropTypes.objectOf(PropTypes.string),
};

LocationSearchInput.defaultProps = {
  name: 'addressLookup',
  label: '',
  promptText: '',
  promptMobile: '',
  hint: '',
  optionalText: '',
  searchCharLength: 4,
  loadingText: '',
  address: {},
  enableForm: () => {},
  updateAddress: () => {},
  mapToField: '',
  types: [],
  addressNotFound: '',
  setFocus: false,
  error: undefined,
  addressAPIState: {
    addressAPIStateTypeId: '',
    addressAPIStateName: '',
  },
};
