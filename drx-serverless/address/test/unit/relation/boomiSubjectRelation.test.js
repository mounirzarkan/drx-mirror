'use strict';

const {expect} = require('chai');
const BoomiSubjectRelation = require('../../../src/relation/BoomiSubjectRelation.js');

describe('BoomiSubjectRelation', () => {
  const relationshipWithCarerResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 2,
      page: 1,
      limit: 10,
      count: 2
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

  const relationshipWithRecipientsResponseStr = JSON.stringify({
    _meta: {
      totalRecords: 2,
      page: 1,
      limit: 10,
      count: 2
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

  describe('retrieveAddress', () => {
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
  });
  describe('retrieveAddress - isPermittedToViewEdit', () => {
    const relationshipWithRecipientsResponseStr = JSON.stringify({
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
            cochlearId: '187509945837581',
            role: 'recipient' // dependent
          },
          relatedPatient: {
            cochlearId: '198005035636309',
            firstName: 'first1',
            lastName: 'last1',
            middleName: 'midName1',
            phone: '1111111111',
            email: 'emailxx438736z@mail.uu',
            isDeceased: false,
            isUnderAge: false,
            dateOfBirth: '1974-11-01'
          }
        }
      ]
    });
    const relationshipWithUnderageRecipientsResponseStr = JSON.stringify({
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
            cochlearId: '187509945837581',
            role: 'recipient' //dependent
          },
          relatedPatient: {
            cochlearId: '198005035636309',
            firstName: 'first1',
            lastName: 'last1',
            middleName: 'midName1',
            phone: '1111111111',
            email: 'emailxx438736z@mail.uu',
            isDeceased: false,
            isUnderAge: true,
            dateOfBirth: '1974-11-01'
          }
        }
      ]
    });
    const relationshipWithCarerResponseStr = JSON.stringify({
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
            role: 'carer'
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
        }
      ]
    });
    const relationshipWithMultipleCarerResponseStr = JSON.stringify({
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
            role: 'carer'
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
            role: 'carer'
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
        }
      ]
    });

    //obj is id query param?
    //sub is requestor?
    it('CASE: Checks view permissions for a carer address as a recipient requestor - false ', () => {
      const subjectRelationSub = new BoomiSubjectRelation(['Recipient']);
      subjectRelationSub.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation(['Carer']);
      subjectRelationObj.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const patientId = '187509945837581';
      const result = subjectRelationSub.isPermittedToViewEdit(
        patientId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });

    it('CASE: Checks view permissions for a recipient(adult) address as a carer requestor(with a single carer) - true ', () => {
      const subjectRelationSub = new BoomiSubjectRelation(['Carer']);
      subjectRelationSub.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );

      const patientId = '198005035636309';
      const result = subjectRelationSub.isPermittedToViewEdit(
        patientId,
        subjectRelationObj
      );
      expect(result).to.equal(true);
    });

    it('CASE: Checks view permissions for a recipient(minor) address as a carer requestor(with a single carer) - true ', () => {
      const subjectRelationSub = new BoomiSubjectRelation(['Carer']);
      subjectRelationSub.setPatientRelations(
        JSON.parse(relationshipWithUnderageRecipientsResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithCarerResponseStr)
      );

      const patientId = '198005035636309';
      const result = subjectRelationSub.isPermittedToViewEdit(
        patientId,
        subjectRelationObj
      );
      expect(result).to.equal(true);
    });

    it('CASE: Checks view permissions for a recipient(minor) address as a carer requestor(with multiple carers) - false ', () => {
      const subjectRelationSub = new BoomiSubjectRelation(['Carer']);
      relationshipWithRecipientsResponseStr.pa;
      subjectRelationSub.setPatientRelations(
        JSON.parse(relationshipWithUnderageRecipientsResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithMultipleCarerResponseStr)
      );

      const patientId = '198005035636309';
      const result = subjectRelationSub.isPermittedToViewEdit(
        patientId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });

    it('CASE: Checks view permissions for a recipient(adult) address as a carer requestor(with multiple carers) - false ', () => {
      const subjectRelationSub = new BoomiSubjectRelation(['Carer']);
      subjectRelationSub.setPatientRelations(
        JSON.parse(relationshipWithRecipientsResponseStr)
      );

      const subjectRelationObj = new BoomiSubjectRelation(['Recipient']);
      subjectRelationObj.setCarerRelations(
        JSON.parse(relationshipWithMultipleCarerResponseStr)
      );

      const patientId = '198005035636309';
      const result = subjectRelationSub.isPermittedToViewEdit(
        patientId,
        subjectRelationObj
      );
      expect(result).to.equal(false);
    });
  });
});
