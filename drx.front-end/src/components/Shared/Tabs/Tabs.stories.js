/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import Tabs from './Tabs';

export default {
  title: 'Shared/Tabs',
  component: Tabs,
  decorators: [StoryRouter()],
};

const Template = args => <Tabs {...args} />;

// Name your stories after layers in the collection
export const tabsMultiple = Template.bind({});
tabsMultiple.args = {
  data: {
    tabsData: {
      accountId: '1111',
      labels: {
        promptText: 'Select a recipient...',
        promptTextAbbrv: 'Recipient...',
        type: 'Recipients',
      },
      tabs: [
        {
          tabIndex: 0,
          type: 'Carer',
          userId: '1111',
          firstName: 'Alex',
          lastName: 'Smith',
        },
        {
          tabIndex: 1,
          type: 'Recipient',
          userId: '1112',
          firstName: 'Brenda',
          lastName: 'Smith',
        },
        {
          tabIndex: 2,
          type: 'Recipient',
          userId: '1113',
          firstName: 'Lara',
          lastName: 'Smith',
        },
        {
          tabIndex: 3,
          type: 'Recipient',
          userId: '1114',
          firstName: 'Sam',
          lastName: 'Smith',
        },
        {
          tabIndex: 4,
          type: 'Recipient',
          userId: '1115',
          firstName: 'Taron',
          lastName: 'Smith',
        },
      ],
    },
    content: {
      text: 'Show content for :',
    },
  },
};
tabsMultiple.storyName = 'Multiple';

export const tabsSingle = Template.bind({});
tabsSingle.args = {
  data: {
    tabsData: {
      accountId: '1111',
      labels: {},
      tabs: [
        {
          tabIndex: 0,
          type: 'Carer',
          userId: '1111',
          firstName: 'Alex',
          lastName: ' Smith',
        },
      ],
    },
    content: {
      text: 'Show content for tab ID:',
    },
  },
};
tabsSingle.storyName = 'Single User';

export const tabsCouple = Template.bind({});
tabsCouple.args = {
  data: {
    tabsData: {
      accountId: '1111',
      labels: {
        promptText: 'Select a recipient...',
        promptTextAbbrv: 'Recipient...',
        type: 'Recipients',
      },
      tabs: [
        {
          tabIndex: 0,
          type: 'Carer',
          userId: '1111',
          firstName: 'Alex',
          lastName: ' Smith',
        },
        {
          tabIndex: 1,
          type: 'Recipient',
          userId: '1112',
          firstName: 'Brenda',
          lastName: ' Smith',
        },
      ],
    },
    content: {
      text: 'Show content for tab ID:',
    },
  },
};
tabsCouple.storyName = 'Couple';

// when tabs length = 1, dont show tabs
// when tabs length = 2 show two tabs
// when tabs length > 2 show multi tabs
