/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TotalSummary from './TotalSummary';

export default {
  title: 'Shared/TotalSummary',
  component: TotalSummary,
};

const Template = args => <TotalSummary {...args} />;

export const totalSummary = Template.bind({});
totalSummary.args = {
  data: [
    { label: 'Order amount:', value: '99999.99', id: 'order-amount' },
    { label: 'Tax:', value: '99999.99', id: 'tax' },
    { label: 'Charges:', value: '99999.99', id: 'charges' },
    { label: 'Total:', value: '99999.99', id: 'total' },
  ],
  config: {
    country: 'AU',
    language: 'en',
    mask: 'AUD',
  },
};

totalSummary.storyName = 'Total Summary';
