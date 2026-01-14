'use strict';

const {expect} = require('chai');
const BoomiSubjectRelation = require('../../../src/relation/BoomiSubjectRelation.js');

describe('BoomiSubjectRelation', () => {
  const relationshipWithCarerResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 3,
      page: 1,
      limit: 10,
      count: 3
    },
    patientPatientList: [
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Carer'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: false
        }
      },
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Carer'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: false
        }
      },
      {
        patientPatient: {
          id: 'a0E6N00000AmC1lUAF',
          cochlearId: '198005035636309',
          role: 'Carer'
        },
        relatedPatient: {
          cochlearId: '188632516720651',
          firstName: 'first2',
          lastName: 'last2',
          phone: '5555707382',
          email: '383530@pacount.com',
          isDeceased: false,
          isUnderAge: false,
          shippingAddress: {
            street: ['BFXZ336680'],
            city: 'RIPLEY',
            state: 'TN',
            postalCode: '38063',
            stateCode: 'TN',
            country: 'United States',
            countryCode: 'US'
          }
        }
      }
    ]
  });
  const relationshipWithSingleCarerResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 1,
      page: 1,
      limit: 10,
      count: 1
    },
    patientPatientList: [
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Carer'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: false
        }
      }
    ]
  });

  const relationshipWithRecipientsResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 3,
      page: 1,
      limit: 10,
      count: 3
    },
    patientPatientList: [
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Recipient'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          middleName: 'midName1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: false,
          dateOfBirth: '1974-11-01'
        }
      },
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Recipient'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          middleName: 'midName1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: false,
          dateOfBirth: '1974-11-01'
        }
      },
      {
        patientPatient: {
          id: 'a0E6N00000AmC1lUAF',
          cochlearId: '198005035636309',
          role: 'Recipient'
        },
        relatedPatient: {
          cochlearId: '188632516720651',
          firstName: 'first2',
          lastName: 'last2',
          middleName: 'midName2',
          phone: '5555707382',
          email: '383530@pacount.com',
          isDeceased: false,
          isUnderAge: false,
          dateOfBirth: '1974-11-02',
          shippingAddress: {
            street: ['BFXZ336680'],
            city: 'RIPLEY',
            state: 'TN',
            postalCode: '38063',
            stateCode: 'TN',
            country: 'United States',
            countryCode: 'US'
          }
        }
      }
    ]
  });

  const relationshipWithUnderageRecipientsResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 3,
      page: 1,
      limit: 10,
      count: 3
    },
    patientPatientList: [
      {
        patientPatient: {
          id: 'a0E6N00000Alg59UAB',
          cochlearId: '198005035636309',
          role: 'Recipient'
        },
        relatedPatient: {
          cochlearId: '187509945837581',
          firstName: 'first1',
          lastName: 'last1',
          middleName: 'midName1',
          phone: '1111111111',
          email: 'emailxx438736z@mail.uu',
          isDeceased: false,
          isUnderAge: true,
          dateOfBirth: '1974-11-01'
        }
      },
      {
        patientPatient: {
          id: 'a0E6N00000AmC1lUAF',
          cochlearId: '198005035636309',
          role: 'Recipient'
        },
        relatedPatient: {
          cochlearId: '188632516720651',
          firstName: 'first2',
          lastName: 'last2',
          middleName: 'midName2',
          phone: '5555707382',
          email: '383530@pacount.com',
          isDeceased: false,
          isUnderAge: false,
          dateOfBirth: '1974-11-02',
          shippingAddress: {
            street: ['BFXZ336680'],
            city: 'RIPLEY',
            state: 'TN',
            postalCode: '38063',
            stateCode: 'TN',
            country: 'United States',
            countryCode: 'US'
          }
        }
      }
    ]
  });

  describe('getUserInfo', () => {
    it('CASE: Requestor Recipient - getRelatedCarers should return attributes correctly', () => {
      const subjectRelation = new BoomiSubjectRelation([
        'Recipient',
        'Candidate'
      ]);

      subjectRelation.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );

      const result = subjectRelation.getRelatedCarers();
      expect(result.length).to.equal(2);
      expect(result[0]).with.property('cochlearId').to.equal('187509945837581');
      expect(result[0]).with.property('firstName').to.equal('first1');
      expect(result[0]).with.property('lastName').to.equal('last1');
      expect(result[1]).with.property('cochlearId').to.equal('188632516720651');
      expect(result[1]).with.property('firstName').to.equal('first2');
      expect(result[1]).with.property('lastName').to.equal('last2');
    });

    it('CASE: Requestor Carer - getRelatedRecipients should return attributes correctly', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Candidate']);

      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const result = subjectRelation.getRelatedRecipients();
      expect(result.length).to.equal(2);
      expect(result[0]).with.property('cochlearId').to.equal('187509945837581');
      expect(result[0]).with.property('firstName').to.equal('first1');
      expect(result[0]).with.property('lastName').to.equal('last1');
      expect(result[0]).with.property('dateOfBirth').to.equal('1974-11-01');
      expect(result[0]).with.property('lastName').to.equal('last1');
      expect(result[0]).not.to.have.property('middleName');
      expect(result[1]).with.property('cochlearId').to.equal('188632516720651');
      expect(result[1]).with.property('firstName').to.equal('first2');
      expect(result[1]).with.property('lastName').to.equal('last2');
      expect(result[1]).with.property('middleName').to.equal('midName2');
      expect(result[1]).with.property('dateOfBirth').to.equal('1974-11-02');
    });

    // does this happen - adding check for mismatch and not return anything
    it('CASE: Requestor Candidate - getRelatedRecipients should return attributes correctly', () => {
      const subjectRelation = new BoomiSubjectRelation(['Candidate']);

      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const result = subjectRelation.getRelatedRecipients();
      expect(result.length).to.equal(0);
    });

    it('CASE: Checks edit permissions(account details)  for a carer requestor for a recipient - true ', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Canditate']);
      const cochlearId = '187509945837581';
      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const result = subjectRelation.isPermittedToViewEditAccountDetails(
        cochlearId,
        subjectRelation
      );
      expect(result).to.equal(true);
    });

    it('CASE: Checks edit permissions(account details)  for a recipient requestor for a carer - false', () => {
      const subjectRelation = new BoomiSubjectRelation([
        'Recipient',
        'Canditate'
      ]);
      const cochlearId = '1875099458375';
      subjectRelation.setCarerRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const result = subjectRelation.isPermittedToViewEditAccountDetails(
        cochlearId,
        subjectRelation
      );
      expect(result).to.equal(false);
    });

    it('CASE: Checks view/edit permissions(phone details) for a carer requestor for an adult recipient(single carer)- true ', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Canditate']);
      const cochlearId = '187509945837581';
      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );
      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithSingleCarerResponseStr)
      );
      const result = subjectRelation.isPermittedToViewEditPhoneDetails(
        cochlearId,
        subjectRelationObj
      );
      expect(result).to.equal(true);
    });

    it('CASE: Checks view/edit permissions(phone details) for a carer requestor for an adult recipient(multiple carer)- false ', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Canditate']);
      const cochlearId = '187509945837581';
      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );
      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );
      const result = subjectRelation.isPermittedToViewEditPhoneDetails(
        cochlearId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });

    it('CASE: Checks view/edit permissions(phone details) for a carer requestor for an underage recipient(multiple carer)- false ', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Canditate']);
      const cochlearId = '187509945837581';
      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithUnderageRecipientsResponseStr)
      );
      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );
      const result = subjectRelation.isPermittedToViewEditPhoneDetails(
        cochlearId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });

    it('CASE: Checks view/edit permissions(phone details) for a carer requestor for an underage recipient(single carer) - true ', () => {
      const subjectRelation = new BoomiSubjectRelation(['Carer', 'Canditate']);
      const cochlearId = '187509945837581';
      subjectRelation.setPatientRelations(
        JSON.parse(relationshipWithUnderageRecipientsResponseStr)
      );
      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithSingleCarerResponseStr)
      );
      const result = subjectRelation.isPermittedToViewEditPhoneDetails(
        cochlearId,
        subjectRelationObj
      );
      expect(result).to.equal(true);
    });

    it('CASE: Checks view/edit permissions(phone details) for a recipient requestor for a carer - false', () => {
      const subjectRelation = new BoomiSubjectRelation([
        'Recipient',
        'Canditate'
      ]);
      const cochlearId = '1875099458375';
      subjectRelation.setCarerRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation([
        'Recipient',
        'Canditate'
      ]);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );
      const result = subjectRelation.isPermittedToViewEditPhoneDetails(
        cochlearId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });
  });
});
