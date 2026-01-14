import {
  US_address,
  CA_address,
  PR_address,
  GB_address,
  IE_address,
  AU_address,
  NZ_address,
} from '../_mock';

//#region  US

export const addressData_US = {
  addressId: 'a0H1j000008DGKHEA4',
  street1: '123 Melrose Street',
  street2: null,
  street3: null,
  street4: null,
  city: 'Brooklyn',
  state: 'NY',
  postalCode: '11206',
  countryIso2Code: 'US',
  countryName: 'United States',
};

export const addressConfig_US = {
  ...US_address,
};

export const addressConfig_US_readOnly = {
  ...US_address,
  mode: 'readOnly',
};
//#endregion

//#region  PR
export const addressConfig_PR = {
  ...US_address,
};

export const addressConfig_PR_readOnly = {
  ...PR_address,
  mode: 'readOnly',
};

//#endregion

//#region  CA

export const addressConfig_CA = {
  ...CA_address,
};

export const addressConfig_CA_readOnly = {
  ...CA_address,
  mode: 'readOnly',
};

export const addressData_CA = {
  street1: '4953 Glover Road',
  street2: '',
  city: 'Coquitlam',
  state: 'BC',
  postalCode: 'V3J 4S1',
  countryIso2Code: 'CA',
  countryName: 'Canada',
};

//#endregion

//#region  GB

export const addressConfig_GB = {
  ...GB_address,
};

export const addressConfig_GB_readOnly = {
  ...GB_address,
  mode: 'readOnly',
};

export const addressData_GB = {
  street1: '123 Buckingham Palace Road',
  street2: '',
  city: 'London',
  state: '',
  postalCode: 'SW1W 9SR',
  countryIso2Code: 'UK',
  countryName: 'United Kingdom',
};
//#endregion

//#region  IE

export const addressConfig_IE = {
  ...IE_address,
};

export const addressConfig_IE_readOnly = {
  ...IE_address,
  mode: 'readOnly',
};

//#endregion

//#region  AU

export const addressConfig_AU = {
  ...AU_address,
};

export const addressConfig_AU_readOnly = {
  ...AU_address,
  mode: 'readOnly',
};

export const addressData_AU = {
  street1: '121 Benny Street',
  street2: '',
  city: 'South Spreyton',
  state: 'TAS',
  postalCode: '7310',
  countryIso2Code: 'AU',
  countryName: 'Australia',
};

export const addressData_AU_missing = {
  street1: '',
  street2: '',
  city: '',
  state: '',
  postalCode: '7310',
  countryIso2Code: 'AU',
  countryName: 'Australia',
};
//#endregion

//#region  NZ
export const addressConfig_NZ = {
  ...NZ_address,
};

export const addressConfig_NZ_readOnly = {
  ...NZ_address,
  mode: 'readOnly',
};

//#endregion
