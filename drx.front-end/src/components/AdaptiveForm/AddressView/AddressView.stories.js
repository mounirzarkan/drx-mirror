/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { labels } from '../_mock';
import { adaptiveFormsQuery } from '../../../gql/adaptiveFormsQuery.mock';
import AddressView from './AddressView';
import {
  addressConfig_US,
  addressData_US,
  addressConfig_AU,
  addressData_AU,
  addressConfig_CA,
  addressData_CA,
  addressConfig_GB,
  addressData_GB,
  addressData_AU_missing,
} from './_mock';

export default {
  title: 'Adaptive Form/Address View/Containter',
  component: AddressView,
};

const Template = args => <AddressView {...args} />;

//-----------
//#region US
//-----------
export const US = Template.bind({});
US.args = {
  config: addressConfig_US,
  data: addressData_US,
  labels: labels,
};
US.storyName = 'US';
//#endregion

//-----------
//#region AU
//-----------
export const AU = Template.bind({});
AU.args = {
  config: addressConfig_AU,
  data: addressData_AU,
  labels: labels,
};
AU.storyName = 'AU';

export const AUMissing = Template.bind({});
AUMissing.args = {
  config: addressConfig_AU,
  data: addressData_AU_missing,
  labels: labels,
};
AUMissing.storyName = 'AU Missing';

//#endregion

//-----------
//#region CA
//-----------
export const CA = Template.bind({});
CA.args = {
  config: addressConfig_CA,
  data: addressData_CA,
  labels: labels,
};
CA.storyName = 'CA';
//#endregion

//-----------
//#region  GB
//-----------
export const GB = Template.bind({});
GB.args = {
  config: addressConfig_GB,
  data: addressData_GB,
  labels: labels,
};
GB.storyName = 'GB';
//#endregion
