import React from 'react';
import PropTypes from 'prop-types';
import { FormattedCurrency } from '@cochlear-design-system/foundation';

function TotalSummary(props) {
  const { data, config } = props;

  return (
    <div className="ccl-e-total-summary">
      {data.map(({ label, value, id }, index) => {
        // Dont show total value individually for KR as it always returns 0
        if (id === 'total' && config.country.toLowerCase() === 'fr') {
          return null;
        }

        if (index + 1 >= data.length) {
          return (
            <div
              key={id}
              className="ccl-e-total-summary__item ccl-e-total-summary__item--total"
            >
              <div className="ccl-e-total-summary__item__label ccl-e-total-summary__item__label">
                <span data-nw-total-label={`${id}`}>{label}</span>
              </div>
              <div className="ccl-e-total-summary__item__value ccl-e-total-summary__item__value">
                <FormattedCurrency
                  data-nw-currency-format={config?.mask}
                  data-nw-total-value={`${id}`}
                  config={config}
                  data={value}
                />
              </div>
            </div>
          );
        }
        // Dont show tax value individually for JP as it always returns 0
        if (id === 'tax' && config.country.toLowerCase() === 'jp')
          return null;

        return (
          <div key={id} className="ccl-e-total-summary__item">
            <div className="ccl-e-total-summary__item__label">
              <span data-nw-total-label={`${id}`}>{label}</span>
            </div>
            <div className="ccl-e-total-summary__item__value">
              <FormattedCurrency
                data-nw-currency-format={config?.mask}
                data-nw-total-value={`${id}`}
                config={config}
                data={value}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TotalSummary;

TotalSummary.propTypes = {
  /**
    Data array containing:
     label and value to display.
     id - used for data nw attribute and item keys
  */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      id: PropTypes.string,
    }),
  ),
  /**
    config - FormattedCurrency config
  */
  config: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.func,
    ]),
  ),
};

TotalSummary.defaultProps = {
  data: [],
  config: {
    country: 'US',
    language: 'en',
    mask: 'USD',
  },
};
