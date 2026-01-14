/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import ToolBar from './ToolBar';

export default {
  title: 'Shared/ToolBar',
  component: ToolBar,
  decorators: [StoryRouter()],
};

const Template = args => <ToolBar {...args} />;

export const single = Template.bind({});

single.args = {
  backHandle: null,
  backLinkTo: null,
  backText: 'Orders',
  currentText: null,
  items: [],
};
single.storyName = 'Single';

export const multiple = Template.bind({});

multiple.args = {
  backHandle: () => {},
  backLinkTo: '/back',
  backText: 'Orders',
  currentText: 'Order: US000123456',
  items: [
    {
      type: 'printer',
      text: 'Print',
      linkTo: null,
      onHandle: () => {
        window.print();
      },
      disabled: false,
    },
    {
      type: 'chevron-left',
      text: 'Prev',
      linkTo: '/prev',
      onHandle: () => {},
      disabled: false,
    },
    {
      type: 'chevron-right',
      text: 'Next',
      linkTo: '/next',
      onHandle: () => {},
      disabled: false,
    },
  ],
};
multiple.storyName = 'Multiple';
