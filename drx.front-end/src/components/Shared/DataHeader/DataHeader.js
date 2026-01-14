import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from '@cochlear-design-system/foundation';

function renderItem(id, type, value, config) {
  switch (type) {
    case 'combined-label': {
      const part1 = (value && value.length > 0 && value[0]) || '';
      const part2 =
        (value && value.length > 1 && value[1] && value[1]) || '';
      const separator = part2 && part2 !== '' ? ' ' : '';
      return (
        <span
          data-nw-header-value={`${id}`}
          data-nw-header-combined-value={`${part1}${separator}${part2}`}
        >
          <span
            data-nw-header-value={`${id}-part-1`}
            data-nw-header-part-one={part1}
            className="ccl-e-data-header__item__value__portion--bold"
          >
            {part1}
          </span>
          <span
            data-nw-header-part-two={part2}
            data-nw-header-value={`${id}-part-2`}
          >
            {separator + part2}
          </span>
        </span>
      );
    }
    case 'label-status': {
      return (
        <span data-nw-header-value={`${id}`}>
          {Array.isArray(value) && value.length > 1
            ? value[1]
            : value}
        </span>
      );
    }
    case 'label': {
      return <span data-nw-header-value={`${id}`}>{value}</span>;
    }
    case 'date': {
      return (
        <FormattedDate
          data-nw-date-format={(config && config.mask) || ''}
          data-nw-header-value={`${id}`}
          config={config}
          data={value}
        />
      );
    }
    default: {
      return <span data-nw-header-value={`${id}`}>{value}</span>;
    }
  }
}

function DataHeader(props) {
  const { items } = props;
  return (
    <div className="ccl-e-data-header">
      <figure className="image image--print-logo is-print-only">
        <img
          src="https://assets.cochlear.com/api/public/content/89a2ac1ae1e046069e3b37a3bf54431b?v=015cdf30"
          alt="Cochlear"
          style={{ width: '126px' }}
        />
      </figure>

      {items.map(({ type, label, value, id, config }) => {
        return (
          <div
            key={id}
            className={`ccl-e-data-header__item ${
              id === 'order-name' ? 'is-print-only' : ''
            }`}
          >
            <div className="ccl-e-data-header__item__label">
              <span data-nw-header-label={`${id}`}>{label}</span>
            </div>
            <div className="ccl-e-data-header__item__value">
              {renderItem(id, type, value, config)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DataHeader;

DataHeader.propTypes = {
  /**
    Items - type (combined-label || label || date), 
    value (string array for combined-label else string), 
    config (FormattedDate config)
  */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
      ]),
      id: PropTypes.string,
      config: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
          PropTypes.func,
        ]),
      ),
    }),
  ),
};

DataHeader.defaultProps = {
  items: [],
};
