import React from 'react';
import StoryRouter from 'storybook-react-router';
import DataTable from './DataTable';

export default {
  title: 'Shared/DataTable',
  component: DataTable,
  decorators: [StoryRouter()],
};

const Template = args => <DataTable {...args} />;

export const list = Template.bind({});
list.args = {
  data: [
    {
      orderNumberOrderDate: ['2021-07-28', '0123456789'],
      orderNumber: '0123456789',
      orderDate: '2021-07-28',
      status: ['02', 'Shipped'],
      amount: '99999.99',
      view: '0123456789',
    },
    {
      orderNumberOrderDate: ['2021-07-29', '0022334455'],
      orderNumber: '0022334455',
      orderDate: '2021-07-29',
      status: ['01', 'In progress'],
      amount: '19999.99',
      view: '0022334455',
    },
    {
      orderNumberOrderDate: ['2021-08-28', '022022334455'],
      orderNumber: '022022334455',
      orderDate: '2021-08-28',
      status: ['03', 'Cancelled'],
      amount: '39999.99',
      view: '022022334455',
    },
  ],
  config: {
    country: 'US',
    language: 'en',
    formats: {
      date: 'mmm dd yyyy',
      currency: 'USD',
    },
    handleSortDataChange: () => {}, // callback function
    columns: [
      {
        field: 'orderNumberOrderDate',
        display: 'labels.orders.columnHeaders.orderNumberOrderDate',
        format: {
          type: 'dateTimeHybrid',
        },
        hiddenColumnView: 'tablet', // hide this colum on this view (mobile|tablet>)
        sortable: true,
        syncSort: 'orderDate', // where columns are hidden for different views but you want to maintain active sort icon (must both be sortabe and contain same sorted data)
      },
      {
        field: 'orderNumber',
        display: 'labels.orders.columnHeaders.orderNumber',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
      },
      {
        field: 'orderDate',
        display: 'labels.orders.columnHeaders.orderDate',
        format: {
          type: 'dateTime',
        },
        hiddenColumnView: 'mobile',
        sortable: true,
        default: 'asc', // sort this column by default (asc/desc)
        syncSort: 'orderNumberOrderDate',
      },
      {
        field: 'status',
        display: 'labels.orders.columnHeaders.status',
        format: {
          type: 'status',
        },
        sortable: true,
      },
      {
        field: 'amount',
        display: 'labels.orders.columnHeaders.amount',
        format: {
          type: 'currency',
        },
        sortable: true,
        alignment: 'right',
        restrictWidth: true,
      },
      {
        field: 'view',
        display: 'labels.orders.columnHeaders.view',
        format: {
          type: 'orderLink',
        },
        hiddenColumnLabel: true,
        sortable: false,
        restrictWidth: true, // restrict this cell from growing beyond the bounds of required cell content
      },
    ],
  },
  labels: {
    'labels.orders.columnHeaders.orderNumberOrderDate': 'Order/Date',
    'labels.orders.columnHeaders.orderNumber': 'Order number',
    'labels.orders.columnHeaders.orderDate': 'Order date',
    'labels.orders.columnHeaders.status': 'Status',
    'labels.orders.columnHeaders.amount': 'Amount',
    'labels.orders.columnHeaders.view': 'View',
  },
};
list.storyName = 'List View';

export const listOneRow = Template.bind({});
listOneRow.args = {
  data: [
    {
      orderNumberOrderDate: ['2021-07-28', '0123456789'],
      orderNumber: '0123456789',
      orderDate: '2021-07-28',
      status: ['02', 'Shipped'],
      amount: '99999.99',
      view: '0123456789',
    },
  ],
  config: {
    country: 'US',
    language: 'en',
    formats: {
      date: 'mmm dd yyyy',
      currency: 'USD',
    },
    handleSortDataChange: () => {}, // callback function
    columns: [
      {
        field: 'orderNumberOrderDate',
        display: 'labels.orders.columnHeaders.orderNumberOrderDate',
        format: {
          type: 'dateTimeHybrid',
        },
        hiddenColumnView: 'tablet', // hide this colum on this view (mobile|tablet>)
        sortable: true,
        syncSort: 'orderDate', // where columns are hidden for different views but you want to maintain active sort icon (must both be sortabe and contain same sorted data)
      },
      {
        field: 'orderNumber',
        display: 'labels.orders.columnHeaders.orderNumber',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
      },
      {
        field: 'orderDate',
        display: 'labels.orders.columnHeaders.orderDate',
        format: {
          type: 'dateTime',
        },
        hiddenColumnView: 'mobile',
        sortable: true,
        default: 'asc', // sort this column by default (asc/desc)
        syncSort: 'orderNumberOrderDate',
      },
      {
        field: 'status',
        display: 'labels.orders.columnHeaders.status',
        format: {
          type: 'status',
        },
        sortable: true,
      },
      {
        field: 'amount',
        display: 'labels.orders.columnHeaders.amount',
        format: {
          type: 'currency',
        },
        sortable: true,
        alignment: 'right',
        restrictWidth: true,
      },
      {
        field: 'view',
        display: 'labels.orders.columnHeaders.view',
        format: {
          type: 'orderLink',
        },
        hiddenColumnLabel: true,
        sortable: false,
        restrictWidth: true, // restrict this cell from growing beyond the bounds of required cell content
      },
    ],
  },
  labels: {
    'labels.orders.columnHeaders.orderNumberOrderDate': 'Order/Date',
    'labels.orders.columnHeaders.orderNumber': 'Order number',
    'labels.orders.columnHeaders.orderDate': 'Order date',
    'labels.orders.columnHeaders.status': 'Status',
    'labels.orders.columnHeaders.amount': 'Amount',
    'labels.orders.columnHeaders.view': 'View',
  },
};
listOneRow.storyName = 'List View One Row';

export const details = Template.bind({});
details.args = {
  data: [
    {
      item: '1',
      quantity: '1',
      partNumber: 'B5SPOWERUP',
      description: 'Baha Super Power - upgrade',
      status: 'Shipped',
      unitPrice: '9999.99',
      totalPrice: '9999.99',
      detailedInformation: [
        'B5SPOWERUP',
        'Baha Super Power - upgrade',
        'Shipped',
        '1',
        '9999.99',
      ],
      total: '9999.99',
    },
    {
      item: '2',
      quantity: '3',
      partNumber: 'B5SPOWERUPXL',
      description: 'Baha Super Power XL - upgrade',
      status: 'Cancelled',
      unitPrice: '99999.99',
      totalPrice: '299999.97',
      detailedInformation: [
        'B5SPOWERUPXL',
        'Baha Super Power XL - upgrade',
        'Cancelled',
        '3',
        '99999.99',
      ],
      total: '299999.97',
    },
  ],
  config: {
    country: 'US',
    language: 'en',
    formats: {
      currency: 'USD',
    },
    variant: 'details',
    columns: [
      {
        field: 'item',
        display: 'labels.orders.columnHeaders.item',
        format: {},
        sortable: false,
        restrictWidth: true,
      },
      {
        field: 'quantity',
        display: 'labels.orders.columnHeaders.quantity',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
        restrictWidth: true,
      },
      {
        field: 'partNumber',
        display: 'labels.orders.columnHeaders.partNumber',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
      },
      {
        field: 'description',
        display: 'labels.orders.columnHeaders.description',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
      },
      {
        field: 'status',
        display: 'labels.orders.columnHeaders.status',
        format: {},
        hiddenColumnView: 'mobile',
        sortable: false,
      },
      {
        field: 'unitPrice',
        display: 'labels.orders.columnHeaders.unitPrice',
        format: {
          type: 'currency',
        },
        hiddenColumnView: 'mobile',
        sortable: false,
        restrictWidth: true,
        alignment: 'right',
      },
      {
        field: 'totalPrice',
        display: 'labels.orders.columnHeaders.totalPrice',
        format: {
          type: 'currency',
        },
        hiddenColumnView: 'mobile',
        sortable: false,
        restrictWidth: true,
        alignment: 'right',
      },
      {
        field: 'detailedInformation',
        display: 'labels.orders.columnHeaders.detailedInformation',
        format: {
          type: 'compositeInformation',
          details: {
            part: 'labels.orders.cellDetails.part',
            status: 'labels.orders.cellDetails.status',
            each: 'labels.orders.cellDetails.each',
          },
        },
        hiddenColumnView: 'tablet',
        sortable: false,
      },
      {
        field: 'total',
        display: 'labels.orders.columnHeaders.total',
        format: {
          type: 'currency',
        },
        hiddenColumnView: 'tablet',
        sortable: false,
        restrictWidth: true,
        alignment: 'right',
      },
    ],
  },
  labels: {
    'labels.orders.columnHeaders.item': 'Item',
    'labels.orders.columnHeaders.quantity': 'Qty',
    'labels.orders.columnHeaders.partNumber': 'Part number',
    'labels.orders.columnHeaders.description': 'Description',
    'labels.orders.columnHeaders.status': 'Status',
    'labels.orders.columnHeaders.unitPrice': 'Unit price',
    'labels.orders.columnHeaders.totalPrice': 'Total price',
    'labels.orders.columnHeaders.detailedInformation': 'Description',
    'labels.orders.columnHeaders.total': 'Total',
    'labels.orders.cellDetails.part': 'Part',
    'labels.orders.cellDetails.status': 'Status',
    'labels.orders.cellDetails.each': 'each',
  },
};
details.storyName = 'Details View';

export const noOrders = Template.bind({});
noOrders.args = {
  data: [],
  config: {},
  labels: {
    'labels.orders.message':
      'You don’t have any orders from the past 60 days',
  },
};
noOrders.storyName = 'No Orders';
