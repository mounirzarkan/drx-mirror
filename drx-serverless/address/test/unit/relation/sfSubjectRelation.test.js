'use strict';

const sinon = require('sinon');
const {expect} = require('chai');
const {SFSubjectRelation} = require('../../../src/relation/index.js');
const {utils} = require('../../../src/util/index.js');

describe('SUITE : SubjectRelation', () => {
  describe('getUserInfo', () => {
    let subjectRelation;
    const relationshipResponseStr = JSON.stringify({
      RelatedAccounts: [
        {
          RelationshipType: 'PARENT',
          RecordType: 'Recipient',
          LastName: 'Ward',
          IsCIMEnabled: true,
          FirstName: 'masked by logUtils',
          CochlearId: '162748173278165'
        },
        {
          RelationshipType: 'SPOUSE',
          RecordType: 'Requester',
          LastName: 'CarerLastName',
          IsCIMEnabled: true,
          FirstName: 'CarerFirstName',
          CochlearId: '182512471537556'
        }
      ],
      RecordType: 'Recipient',
      LastName: 'LastName',
      IsCIMEnabled: true,
      FirstName: 'FirstName',
      DateOfBirth: 686188800000,
      CochlearId: '162748173278165'
    });
    // {
    //     sub: '198835944744967',
    //     sub_userType: 'Recipient',
    //     countryCode: 'US',
    //     updateAge: 18,
    //     obj: '198835944744967',
    //     obj_dob: 686188800000,
    //     obj_userType: 'Recipient',
    //     hasCarer: true,
    //     hasMultiCarers: 'false',
    //     relatedCarers: [ 'CarerFirstName CarerLastName' ]
    //   }
    beforeEach(() => {
      subjectRelation = new SFSubjectRelation(
        '198835944744967',
        'Recipient',
        'us'
      );
      subjectRelation.setRelation(
        '198835944744967',
        JSON.parse(relationshipResponseStr)
      );
    });
    it('CASE: setRelation with sfRelationshipResponse returns matching properties: sub,sub_userType,countryCode,updateAge,obj,obj_dob,obj_userType,hasCarer,hasMultiCarers,relatedCarers', () => {
      expect(subjectRelation, 'sub')
        .with.property('sub')
        .to.equal('198835944744967');
      expect(subjectRelation, 'sub_userType')
        .with.property('sub_userType')
        .to.equal('Recipient');
      expect(subjectRelation, 'countryCode')
        .with.property('countryCode')
        .to.equal('US');
      expect(subjectRelation, 'updateAge')
        .with.property('updateAge')
        .to.equal(18);
      expect(subjectRelation, 'obj')
        .with.property('obj')
        .to.equal('198835944744967');
      expect(subjectRelation, 'obj_dob')
        .with.property('obj_dob')
        .to.equal(686188800000);
      expect(subjectRelation, 'obj_userType')
        .with.property('obj_userType')
        .to.equal('Recipient');
      expect(subjectRelation, 'hasCarer')
        .with.property('hasCarer')
        .to.equal(true);
      expect(subjectRelation, 'relatedCarers')
        .with.property('relatedCarers')
        .to.deep.equal(['CarerFirstName CarerLastName']);
    });

    afterEach(() => {
      sinon.restore();
    });
  });

  describe('isScenarioApplicable', () => {
    let subjectRelation;

    beforeEach(() => {
      subjectRelation = new SFSubjectRelation(
        '198835944744967',
        'Recipient',
        'us'
      );
    });

    it('CASE: isScenarioApplicable for carer returns true.', () => {
      subjectRelation.sub_userType = 'carer';
      subjectRelation.hasCarer = false;
      subjectRelation.obj_dob = '1992-12-17T03:24:00';
      subjectRelation.updateAge = 18;
      const isMatch = subjectRelation.isScenarioApplicable(
        'carer',
        'not applicable',
        false
      );
      expect(isMatch).to.equal(true);
    });

    it('CASE: isScenarioApplicable for recipient with a scenario with age greater than "younger than update age" returns false.', () => {
      sinon.stub(utils, 'isAboveAgeBracket').returns(true);
      subjectRelation.obj = '198835944744967';
      subjectRelation.sub_userType = 'recipient';
      subjectRelation.hasCarer = true;
      subjectRelation.obj_dob = '1992-12-17T03:24:00';
      subjectRelation.updateAge = 18;
      const isMatch = subjectRelation.isScenarioApplicable(
        'recipient',
        'younger than update age',
        true
      );
      expect(utils)
        .with.property('isAboveAgeBracket')
        .with.property('callCount')
        .to.equal(1);
      expect(isMatch).to.equal(false);
    });

    it('CASE: isScenarioApplicable for recipient with a scenario with "younger than update age" returns true.', () => {
      sinon.stub(utils, 'isAboveAgeBracket').returns(false);
      subjectRelation.obj = '198835944744967';
      subjectRelation.sub_userType = 'recipient';
      subjectRelation.hasCarer = true;
      subjectRelation.obj_dob = '2012-12-17T03:24:00';
      subjectRelation.updateAge = 18;
      const isMatch = subjectRelation.isScenarioApplicable(
        'recipient',
        'younger than update age',
        true
      );
      expect(utils)
        .with.property('isAboveAgeBracket')
        .with.property('callCount')
        .to.equal(1);
      expect(isMatch).to.equal(true);
    });

    it('CASE: isScenarioApplicable for recipient with a scenario with age less than "older than update age" returns false.', () => {
      sinon.stub(utils, 'isAboveAgeBracket').returns(false);
      subjectRelation.obj = '198835944744967';
      subjectRelation.sub_userType = 'recipient';
      subjectRelation.hasCarer = true;
      subjectRelation.obj_dob = '2012-12-17T03:24:00';
      subjectRelation.updateAge = 18;
      const isMatch = subjectRelation.isScenarioApplicable(
        'recipient',
        'older than update age',
        false
      );
      expect(utils)
        .with.property('isAboveAgeBracket')
        .with.property('callCount')
        .to.equal(1);
      expect(isMatch).to.equal(false);
    });
    afterEach(() => {
      sinon.restore();
    });
  });

  describe('isPermissionApplicable', () => {
    let subjectRelation;

    beforeEach(() => {
      subjectRelation = new SFSubjectRelation(
        '198835944744967',
        'Recipient',
        'us'
      );
    });

    it('CASE: isPermissionApplicable for matching Carer returns true.', () => {
      subjectRelation.obj_userType = 'Carer';
      const result = subjectRelation.isPermissionApplicable('Carer');
      expect(result).to.equal(true);
    });

    it('CASE: isPermissionApplicable for non matching Carer Recipient returns false.', () => {
      subjectRelation.obj_userType = 'Carer';
      const result = subjectRelation.isPermissionApplicable('Recipient');
      expect(result).to.equal(false);
    });
    afterEach(() => {
      sinon.restore();
    });
  });

  describe('SUITE: ', () => {
    let subjectRelation = undefined;
    const relationshipResponseStr = JSON.stringify({
      RelatedAccounts: [
        {
          RelationshipType: 'PARENT',
          RecordType: 'Requester',
          LastName: 'Ward',
          IsCIMEnabled: true,
          FirstName: 'masked by logUtils',
          CochlearId: '162748173278165'
        },
        {
          RelationshipType: 'SPOUSE',
          RecordType: 'Requester',
          LastName: 'CarerLastName',
          IsCIMEnabled: true,
          FirstName: 'CarerFirstName',
          CochlearId: '182512471537556'
        }
      ],
      RecordType: 'Recipient',
      LastName: 'LastName',
      IsCIMEnabled: true,
      FirstName: 'FirstName',
      DateOfBirth: 686188800000,
      CochlearId: '143743213278265'
    });
    beforeEach(() => {
      subjectRelation = new SFSubjectRelation('132927457294729', 'Carer', 'us');
    });

    it('CASE: when setting a relation between a carer (sub) and a recipient (obj) with 2 carers, then setRelation throws 451 error', () => {
      const relationshipResponse = JSON.parse(relationshipResponseStr);
      expect(
        subjectRelation.setRelation.bind(
          subjectRelation,
          '143743213278265',
          relationshipResponse
        )
      )
        .to.throw()
        .and.has.property('message', '451');
    });

    afterEach(() => {
      sinon.restore();
    });
  });
});
