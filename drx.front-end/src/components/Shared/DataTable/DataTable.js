import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Icon,
  Text,
  FormattedLabel,
} from '@cochlear-design-system/foundation';

function rowItems(row, columns, labels, config) {
  const { country, language, formats } = config;
  return (
    columns &&
    columns.map(column => {
      return (
        <td
          key={`td-${column.field}-${row[column.field]}`}
          className={`ccl-e-table__tbody__tr__td ${
            column.hiddenColumnView
              ? `is-hidden-${column.hiddenColumnView}`
              : ''
          } ${
            column.alignment ? `has-text-${column.alignment}` : ''
          }`}
          data-nw-table-row={column.field}
        >
          <FormattedLabel
            config={{
              country,
              language,
              formats,
              ...column.format,
            }}
            data={row[column.field]}
            labels={{
              ...labels,
              column:
                labels[`labels.orders.columnHeaders.${column.field}`],
            }}
          />
        </td>
      );
    })
  );
}

/**
 * Primary UI component for table
 */
function DataTable(props) {
  const { data, config, labels } = props;

  const { formats, columns, variant, handleSortDataChange } = config;

  // current sorted header
  const [sortedHeader, setSortedHeader] = useState('');

  // sort method applied
  const [sortMethod, setSortMethod] = useState('');

  // apply data prop to state tableData
  const [tableData, setTableData] = useState(data);

  // pass through values for the header column so we know which column we want to sort the data by,
  // the table data
  // and the sorting method we want to sort the data by (asc/desc)
  const handleSort = (key, tData, sortBy) => {
    setSortedHeader(key);
    const sortedData = tData.sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (sortBy === 'desc') {
        setSortMethod('desc');
        // comparing two strings
        if (isNaN(x) && isNaN(y)) return x > y ? -1 : x < y ? 1 : 0;
        // comparing two numbers
        return x - y;
      }
      // sortBy asc if not defined
      setSortMethod('asc');
      // comparing two strings
      if (isNaN(x) && isNaN(y)) return x < y ? -1 : x > y ? 1 : 0;
      // comparing two numbers
      return y - x;
    });
    setTableData(sortedData);
    handleSortDataChange(sortedData);
  };

  useEffect(() => {
    columns &&
      columns.map(
        column =>
          column.default &&
          handleSort(column.field, tableData, column.default),
      );

    // update the table data once the new data comes through
    setTableData(data);
    // eslint-disable-next-line
  }, [columns, tableData, data]);

  const history = useHistory();
  const location = useLocation();
  const handleRowClick = (accountId, userId, headerId) => {
    history.push(
      `${location.pathname}?account=${accountId}&user=${userId}&order=${headerId}`,
    );
  };

  if (tableData.length === 0)
    return (
      <Text
        data-nw-empty-order-list
        type="body-text"
        content={labels[`labels.orders.message`]}
      />
    );

  return (
    <table
      className={`ccl-e-table ${
        variant ? `ccl-e-table--${variant}` : ''
      }`}
      data-nw-sort-order={sortMethod}
      data-nw-sort-header={sortedHeader}
      data-nw-date-format={formats && formats.date}
      data-nw-currency-format={formats && formats.currency}
    >
      <thead className="ccl-e-table__thead">
        <tr className="ccl-e-table__thead__tr">
          {columns &&
            columns.map(column => {
              return (
                <th
                  className={`ccl-e-table__thead__tr__th
              ${
                column.hiddenColumnView
                  ? `is-hidden-${column.hiddenColumnView}`
                  : ''
              }
              ${
                column.restrictWidth
                  ? `ccl-e-table__thead__tr__th--restrict-width`
                  : ''
              }
              `}
                  key={column.field}
                  onClick={() => {
                    if (tableData.length > 1) {
                      if (column.sortable) {
                        // check if we are already sorting on this header
                        if (sortedHeader === column.field) {
                          // if we are then we just want to sort by the other sort method
                          const updatedSortOrder =
                            sortMethod === 'asc' ? 'desc' : 'asc';
                          handleSort(
                            column.field,
                            tableData,
                            updatedSortOrder,
                          );
                        } else {
                          // if we weren't sorting by this column, then sort by 'desc' by default
                          setSortMethod('desc');
                          handleSort(column.field, tableData, 'desc');
                        }
                      }
                      return null;
                    }
                    return null;
                  }}
                  data-nw-table-headers={column.field}
                >
                  <div
                    className={`ccl-e-table__thead__column-title ${
                      column.hiddenColumnLabel ? `is-sr-only` : ''
                    }`}
                  >
                    {labels[column.display]}{' '}
                    {tableData.length > 1 && column.sortable && (
                      <Icon
                        color="interactive"
                        rotate={`${
                          sortMethod === 'asc' ? '0' : '180'
                        }`}
                        type="north"
                        size="xs"
                        style={{
                          visibility:
                            sortedHeader === column.field ||
                            sortedHeader === column.syncSort
                              ? 'visible'
                              : 'hidden',
                        }}
                      />
                    )}
                  </div>
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody className="ccl-e-table__tbody">
        {tableData.map((row, index) => (
          <tr
            key={`tr-${Object.keys(row)[0]}-${
              row[Object.keys(row)[0]]
            }`}
            className="ccl-e-table__tbody__tr"
            data-nw-table-row={index + 1}
            onClick={() =>
              config.clickableRow &&
              handleRowClick(
                config.accountId,
                config.userId,
                row.HeaderId,
              )
            }
          >
            {/* iterate over the data object and create a table cell for each row */}
            {rowItems(row, columns, labels, config)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape({
    country: PropTypes.string,
    language: PropTypes.string,
    formats: PropTypes.shape({
      date: PropTypes.string,
      currency: PropTypes.string,
    }),
    variant: PropTypes.string,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        display: PropTypes.string,
        format: PropTypes.shape({
          type: PropTypes.string,
        }),
        hiddenColumnView: PropTypes.string,
        sortable: PropTypes.bool,
        syncSort: PropTypes.string,
        default: PropTypes.string,
        alignment: PropTypes.string,
        restrictWidth: PropTypes.bool,
      }),
    ),
    handleSortDataChange: PropTypes.func,
  }).isRequired,
  labels: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
};
