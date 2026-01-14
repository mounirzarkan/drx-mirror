'use strict';

const {utils, log} = require('../util/index');
const _ = require('lodash');
const updateAgeConfig = require('../data/updateAge.json');
class SFSubjectRelation {
  constructor(sub, sub_userType, countryCode) {
    this.sub = sub;
    this.sub_userType = sub_userType;
    this.countryCode =
      (countryCode != undefined && countryCode.toUpperCase()) || undefined;
    this.updateAge = updateAgeConfig[this.countryCode];
    this.obj = undefined;
    this.obj_dob = undefined;
    this.obj_userType = undefined;
    this.hasCarer = undefined;
    this.hasMultiCarers = false;
    this.relatedCarers = undefined;
    this.relatedRecipients = undefined;
  }

  isScenarioApplicable(userType, ageGroup, hasCarers) {
    if (
      this.sub_userType &&
      utils.stringCompareIgnoreCase(this.sub_userType, userType)
    ) {
      if (utils.stringCompareIgnoreCase(this.sub_userType, 'Carer')) {
        return true;
      } else if (this.sub != undefined && this.sub === this.obj) {
        if (utils.stringCompareIgnoreCase('not applicable', ageGroup)) {
          return hasCarers === this.hasCarer;
        } else {
          const isAboveUpdateAge = utils.isAboveAgeBracket(
            this.obj_dob,
            this.updateAge
          );
          return (
            (utils.stringCompareIgnoreCase('older than update age', ageGroup) &&
              isAboveUpdateAge) ||
            (utils.stringCompareIgnoreCase(
              'younger than update age',
              ageGroup
            ) &&
              !isAboveUpdateAge)
          );
        }
      }
    }
    return false;
  }

  isPermissionApplicable(appliesToUserType) {
    return utils.stringCompareIgnoreCase(this.obj_userType, appliesToUserType);
  }

  isOcSmsRequired() {
    return utils.includeOcSms(this.sub_userType, this.sub, this.obj);
  }

  getRelatedCarers() {
    if (this.relatedCarers) {
      console.log('this.relatedCarers: ', this.relatedCarers);
      var relatedCarersList = this.relatedCarers;
      var unique = [
        ...new Set(relatedCarersList.map((item) => item.CochlearId))
      ].map((x) => relatedCarersList.filter((y) => y.CochlearId === x)[0]);
      console.log('unique-recipients: ', unique);
      return unique;
    }
    return this.relatedCarers;
  }

  getRelatedRecipients() {
    if (this.relatedRecipients) {
      var unique = [
        ...new Set(this.relatedRecipients.map((item) => item.CochlearId))
      ].map((x) => this.relatedRecipients.filter((y) => y.CochlearId === x)[0]);
      console.log('unique-recipients: ', unique);
      return unique;
    }
    return this.relatedRecipients;
  }

  setRelation(obj, relationshipInfo) {
    this.obj = obj;
    this.obj_dob = relationshipInfo.DateOfBirth;
    this.obj_userType = utils.getUserTypeFromRecordType(
      relationshipInfo.RecordType
    );
    const relatedAccounts = relationshipInfo.RelatedAccounts;

    const {noOfCarers, relatedCarers} =
      this._getRelatedCarerInfo(relatedAccounts);

    const {
      // noOfRecipients,
      relatedRecipients
    } = this._getRelatedRecipientInfo(relatedAccounts);

    this.hasCarer = noOfCarers > 0;
    this.hasMultiCarers = noOfCarers > 1;

    if (!_.isEmpty(relatedCarers)) {
      this.relatedCarers = relatedCarers;
    }
    if (!_.isEmpty(relatedRecipients)) {
      this.relatedRecipients = relatedRecipients;
    } else {
      log.info('debug, relatedCarers and relatedRecipients not populated');
    }
  }

  isPhoneRestricted() {
    if (
      utils.stringCompareIgnoreCase('Carer', this.sub_userType) &&
      utils.stringCompareIgnoreCase('Recipient', this.obj_userType)
    ) {
      return this.hasMultiCarers;
    }
    return false;
  }

  _getRelatedCarerInfo(relatedAccounts) {
    let noOfCarers = 0;
    const relatedCarers = [];

    for (const relatedAccount of relatedAccounts) {
      if (
        utils.stringCompareIgnoreCase(this.obj_userType, 'Recipient') &&
        utils.stringCompareIgnoreCase(
          'Carer',
          utils.getUserTypeFromRecordType(relatedAccount.RecordType)
        ) &&
        relatedAccount.IsCIMEnabled
      ) {
        // in current scope only consider carer has cim as carer-recipient relationship
        ++noOfCarers;
        if (utils.stringCompareIgnoreCase(this.sub_userType, 'Recipient')) {
          relatedCarers.push(
            relatedAccount.FirstName + ' ' + relatedAccount.LastName
          );
        }

        log.debug('debug, add relatedAccount: ');
        log.debug(relatedAccount.FirstName + relatedAccount.LastName);
      }
    }
    return {noOfCarers, relatedCarers};
  }

  _getRelatedRecipientInfo(relatedAccounts) {
    let noOfRecipients = 0;
    const relatedRecipients = [];

    for (const relatedAccount of relatedAccounts) {
      if (
        utils.stringCompareIgnoreCase(this.obj_userType, 'Carer') &&
        utils.stringCompareIgnoreCase(
          'Recipient',
          utils.getUserTypeFromRecordType(relatedAccount.RecordType)
        )
      ) {
        ++noOfRecipients;
        if (utils.stringCompareIgnoreCase(this.sub_userType, 'Carer')) {
          relatedRecipients.push({
            firstName: relatedAccount.FirstName,
            lastName: relatedAccount.LastName,
            CochlearId: relatedAccount.CochlearId
          });
        }

        log.debug('debug, add relatedAccount: ');
        log.debug(relatedAccount.FirstName + relatedAccount.LastName);
      }
    }
    return {noOfRecipients, relatedRecipients};
  }
}

module.exports = SFSubjectRelation;
