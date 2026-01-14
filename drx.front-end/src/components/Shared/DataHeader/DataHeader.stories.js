/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import DataHeader from './DataHeader';

export default {
  title: 'Shared/DataHeader',
  component: DataHeader,
};

const Template = args => <DataHeader {...args} />;

export const dataHeader = Template.bind({});
dataHeader.args = {
  items: [
    {
      type: 'combined-label',
      label: 'Order:',
      value: ['US00004513', '(aka 012345689)'],
      id: 'order',
    },
    {
      type: 'date',
      label: 'Order date:',
      value: '2021-01-28',
      config: {
        country: 'US',
        language: 'en',
        mask: 'mmm dd yyyy',
      },
      id: 'order-date',
    },
    {
      type: 'label',
      label: 'Order status:',
      value: 'Shipped',
      id: 'order-status',
    },
  ],
};

dataHeader.storyName = 'Order Header';
