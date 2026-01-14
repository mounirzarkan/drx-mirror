'use strict';

const serviceRequest = require('../../src/service/serviceRequest');
const expect = require('chai').expect;

const cochlear_id = '12345678';
const srForm = {
  serialNumber: '1010116548407',
  productName: 'CP910 PROCESSING UNIT (WHITE)',
  productDescription: 'CP910 PROCESSING UNIT (WHITE)',
  lastWarrantyDate: '1572998400000',
  fittingDate: 1478476800000,
  earSide: 'Unknown',
  deviceType: 'Speech Processor',
  deviceStatus: 'Current',
  firstName: 'Jacky',
  lastName: 'Chang',
  email: 'test@cochlear.com',
  clinic: 'Tom Lee',
  audiologist: 'Mike chen',
  problemTopic: 'power and batteries',
  problemDescription: 'my old processor broken',
  termsConditionTicked: true,
  shippingAddress: {
    address1: '1 university road',
    city: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    country: 'AUS'
  }
};

describe('test serviceRequest.js.', () => {
  describe('#constructDescription. ', () => {
    it('should return correct description string. ', () => {
      const desc = serviceRequest.constructDescription(srForm);
      expect(desc).is.not.null;
      expect(desc).contains('2000');
      expect(desc).contains('device warranty date: 11/06/2019');
      console.log(desc);
    });
  });
  describe('#constructSubmitRequest', () => {
    it('should return correct submitRequest.', () => {
      const sr = serviceRequest.constructSubmitRequest(cochlear_id, srForm);
      console.log(sr);
    });
  });
  describe('#formatDate', () => {
    it('should return correct formatted Date.', () => {
      const formattedDate = serviceRequest.formatDate(1572998400000);
      expect(formattedDate).equal('11/06/2019');
      console.log(formattedDate);
    });
  });
});
