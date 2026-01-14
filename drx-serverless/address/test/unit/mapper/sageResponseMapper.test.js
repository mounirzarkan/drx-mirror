'use strict';

const {expect} = require('chai');
const {sageResponseMapper} = require('../../../src/mapper/index.js');

describe('sageResponseToAddress', () => {
  const sageExpectedAddressessResponse = [
    {
      value: {
        addressId: 'a0H24000001yfZWEAY',
        address: {
          street: [
            'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
          ],
          city: 'KNOXVILLE',
          state: 'TN',
          postalCode: '37920',
          stateCode: 'TN'
        },
        isPO: ''
      },
      isBilling: false,
      isMailing: false,
      isShipping: false,
      countryIso2Code: 'US',
      countryName: 'United States'
    },
    {
      value: {
        addressId: 'a0HE000000k5fr8MAA',
        address: {
          street: [
            'Lauderdale Community Hospital Attn Kelvin Parr\n326 Asbury Ave'
          ],
          city: 'RIPLEY',
          state: 'TN',
          postalCode: '38063',
          stateCode: 'TN'
        },
        isPO: ''
      },
      isBilling: false,
      isMailing: false,
      isShipping: false,
      countryIso2Code: 'US',
      countryName: 'United States'
    },
    {
      value: {
        addressId: 'a0H1p00000NFVjJEAX',
        address: {
          street: ['357 Moore St'],
          city: 'RIPLEY',
          state: 'TN',
          postalCode: '38063',
          stateCode: 'TN'
        },
        isPO: ''
      },
      isBilling: true,
      isMailing: false,
      isShipping: true,
      countryIso2Code: 'US',
      countryName: 'United States'
    }
  ];

  const sageResponseAddressess = {
    _meta: {
      totalRecords: 3,
      page: 1,
      limit: 10,
      count: 3
    },
    patientAddress: [
      {
        id: 'a0H24000001yfZWEAY',
        street: [
          'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
        ],
        city: 'KNOXVILLE',
        state: 'TN',
        stateCode: 'TN',
        postalCode: '37920',
        country: 'United States',
        countryCode: 'US'
      },
      {
        id: 'a0HE000000k5fr8MAA',
        street: [
          'Lauderdale Community Hospital Attn Kelvin Parr\n326 Asbury Ave'
        ],
        city: 'RIPLEY',
        state: 'TN',
        stateCode: 'TN',
        postalCode: '38063',
        country: 'United States',
        countryCode: 'US'
      },
      {
        id: 'a0H1p00000NFVjJEAX',
        street: ['357 Moore St'],
        city: 'RIPLEY',
        state: 'TN',
        stateCode: 'TN',
        postalCode: '38063',
        country: 'United States',
        countryCode: 'US',
        primaryTypes: ['Billing', 'Shipping']
      }
    ]
  };

  const sageExpectedAddressResponse = {
    value: {
      addressId: 'a0H24000001yfZWEAY',
      address: {
        street: [
          'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
        ],
        city: 'KNOXVILLE',
        state: 'TN',
        postalCode: '37920',
        stateCode: 'TN'
      },
      isPO: ''
    },
    isBilling: false,
    isMailing: false,
    isShipping: false,
    countryIso2Code: 'US',
    countryName: 'United States'
  };

  const sageResponseAddress = {
    id: 'a0H24000001yfZWEAY',
    street: [
      'Tenn. School for Deaf ATTN: Crista Duncan\n2725 Island Home Boulevard'
    ],
    city: 'KNOXVILLE',
    state: 'TN',
    stateCode: 'TN',
    postalCode: '37920',
    country: 'United States',
    countryCode: 'US'
  };

  it('CASE: should map the Boomi Response to DRX API successfully', () => {
    const result = sageResponseMapper.sageResponseAddressessMapper(
      sageResponseAddressess
    );
    expect(result).to.deep.equal(sageExpectedAddressessResponse);
  });

  it('CASE: should map the Boomi Response to DRX API successfully', () => {
    const result =
      sageResponseMapper.sageResponseAddressMapper(sageResponseAddress);
    expect(result).to.deep.equal(sageExpectedAddressResponse);
  });
});
