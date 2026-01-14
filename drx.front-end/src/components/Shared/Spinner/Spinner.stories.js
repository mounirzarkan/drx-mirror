/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Spinner from './Spinner';

export default {
  title: 'Shared/Spinner',
  component: Spinner,
};

const Template = args => <Spinner {...args} />;

export const demo = Template.bind({});
demo.args = { text: '' };
demo.storyName = 'Default';
