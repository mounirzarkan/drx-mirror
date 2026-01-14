/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import DetailActionBar from './DetailActionBar';

export default {
  title: 'Shared/DetailActionBar',
  component: DetailActionBar,
};

const Template = args => <DetailActionBar {...args} />;

export const titleClose = Template.bind({});
titleClose.args = {
  title: "Sam's details",
  buttonText: 'edit',
  buttonHandle: () => {},
  buttonIconType: 'edit',
};
titleClose.storyName = 'Title Close';

export const titleOpen = Template.bind({});
titleOpen.args = {
  title: "Sam's details",
  buttonText: 'cancel',
  buttonHandle: () => {},
  buttonIconType: 'close',
  cssModifier: 'highlight',
};
titleOpen.storyName = 'Title Open';

export const titleOnly = Template.bind({});
titleOnly.args = {
  title: "Sam's details",
  hideButton: true,
};
titleOnly.storyName = 'Title Only';
