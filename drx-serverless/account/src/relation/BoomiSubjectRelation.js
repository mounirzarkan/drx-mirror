'use strict';

const {log, utils} = require('../util/index');
class BoomiSubjectRelation {
  constructor(personas) {
    this.relatedCarers = [];
    this.relatedRecipients = [];
    this.hasCarers = false;
    this.hasRecipients = false;
    this.hasMultipleCarers = false;
    this.personas = personas;
  }

  getRelatedCarers() {
    log.debug('this.relatedCarers: ', this.relatedCarers);
    log.debug('this.personas: ', this.personas);
    const returnRelatedCarers = [];
    this.relatedCarers.forEach((x) => {
      // eslint-disable-next-line no-unused-vars
      const {isUnderAge, ...y} = x;
      returnRelatedCarers.push(y);
    });
    const relatedCarersList = returnRelatedCarers;
    const unique = [
      ...new Set(relatedCarersList.map((item) => item.cochlearId))
    ].map((x) => relatedCarersList.filter((y) => y.cochlearId == x)[0]);
    log.debug('getRelatedCarers unique');
    log.debug(unique);
    return this.personas.includes('Recipient') ? unique : [];
  }

  getRelatedRecipients() {
    log.debug('this.relatedRecipients: ', this.relatedRecipients);
    log.debug('this.personas: ', this.personas);
    const returnRelatedRecipients = [];
    this.relatedRecipients.forEach((x) => {
      // eslint-disable-next-line no-unused-vars
      const {isUnderAge, ...y} = x;
      returnRelatedRecipients.push(y);
    });
    const relatedRecipientsList = returnRelatedRecipients;
    const unique = [
      ...new Set(relatedRecipientsList.map((item) => item.cochlearId))
    ].map((x) => relatedRecipientsList.filter((y) => y.cochlearId == x)[0]);
    log.debug('getRelatedRecipients unique');
    log.debug(unique);
    return this.personas.includes('Carer') ? unique : [];
  }

  setCarerRelations(relationshipInfo) {
    log.debug('relationshipInfo', relationshipInfo);
    this.relatedCarers = relationshipInfo.patientPatientList
      .filter((x) =>
        utils.stringCompareIgnoreCase(x.patientPatient.role, 'Carer')
      )
      .reduce((acc, item) => {
        const carer = {
          cochlearId: item.relatedPatient.cochlearId,
          firstName: item.relatedPatient.firstName,
          lastName: item.relatedPatient.lastName,
          isUnderAge: item.relatedPatient.isUnderAge
        };
        item.relatedPatient?.shippingAddress?.countryCode === 'US' &&
          item.relatedPatient.middleName &&
          Object.assign(carer, {middleName: item.relatedPatient.middleName});
        log.debug('carer   : ', carer);
        acc.push(carer);

        return acc;
      }, []);
    this.hasCarers = !!this.relatedCarers.length;
    this.hasMultipleCarers = this.relatedCarers.length > 1;

    log.debug('this.hasCarers ', this.hasCarers);
    log.debug(this.hasCarers);
    log.debug('this.relatedCarers :', this.relatedCarers);
    log.debug(this.relatedCarers);
  }

  setPatientRelations(relationshipInfo) {
    log.debug('relationshipInfo');
    log.debug(relationshipInfo);
    this.relatedRecipients = relationshipInfo.patientPatientList
      .filter(
        (x) =>
          utils.stringCompareIgnoreCase(x.patientPatient.role, 'Recipient') ||
          utils.stringCompareIgnoreCase(x.patientPatient.role, 'Dependent')
      )
      .reduce((acc, item) => {
        const patient = {
          cochlearId: item.relatedPatient.cochlearId,
          firstName: item.relatedPatient.firstName,
          lastName: item.relatedPatient.lastName,
          dateOfBirth: item.relatedPatient.dateOfBirth,
          isUnderAge: item.relatedPatient.isUnderAge
        };
        item.relatedPatient?.shippingAddress?.countryCode === 'US' &&
          item.relatedPatient.middleName &&
          Object.assign(patient, {middleName: item.relatedPatient.middleName});
        acc.push(patient);
        return acc;
      }, []);
    this.hasRecipients = !!this.relatedRecipients.length;
    log.debug('this.hasRecipients');
    log.debug(this.hasRecipients);
    log.debug('this.relatedRecipients');
    log.debug(this.relatedRecipients);
  }

  isPermittedToViewEditAccountDetails(patientId, boomiSubjectRelationObj) {
    log.debug('relatedCarers');
    log.debug(this.relatedCarers);
    log.debug('relatedRecipients');
    log.debug(this.relatedRecipients);
    log.debug('patientId');
    log.debug(patientId);
    log.debug('boomiSubjectRelationObj');
    log.debug(boomiSubjectRelationObj);
    if (
      this.personas.includes('Carer') &&
      this.relatedRecipients.some((x) => x.cochlearId === patientId)
    ) {
      log.debug('isPermittedToViewEditAccountDetails - true');
      return true;
    }
    log.debug('isPermittedToViewEditAccountDetails - false');
    return false;
  }

  isPermittedToViewEditPhoneDetails(patientId, boomiSubjectRelationObj) {
    log.debug('relatedCarers');
    log.debug(this.relatedCarers);
    log.debug('relatedRecipients');
    log.debug(this.relatedRecipients);
    log.debug('patientId');
    log.debug(patientId);
    log.debug('boomiSubjectRelationObj');
    log.debug(boomiSubjectRelationObj);
    if (
      this.personas.includes('Carer') &&
      !boomiSubjectRelationObj.hasMultipleCarers
    ) {
      log.debug('isPermittedToViewEditPhoneDetails - true');
      return true;
    }
    log.debug('isPermittedToViewEditPhoneDetails - false');
    return false;
  }
}

module.exports = BoomiSubjectRelation;
