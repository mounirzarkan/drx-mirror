'use strict';

const {utils, log} = require('../util/index.js');
const _ = require('lodash');
const updateAgeConfig = require('../data/updateAge.json');
class SubjectRelation {
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
    this.hasMultiCarers = undefined;
    this.relatedCarers = undefined;
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
    return this.relatedCarers;
  }

  setRelation(obj, relationshipInfo) {
    this.obj = obj;
    this.obj_dob = relationshipInfo.DateOfBirth;
    this.obj_userType = utils.getUserTypeFromRecordType(
      relationshipInfo.RecordType
    );
    const relatedAccounts = relationshipInfo.RelatedAccounts;

    const {noOfCarers, relatedCarers} = this._getRelatedInfo(relatedAccounts);

    this.hasCarer = noOfCarers > 0;

    this.hasMultiCarers = this._hasMultipleCarers(noOfCarers);

    if (utils.stringCompareIgnoreCase('Carer', this.sub_userType)) {
      if (utils.stringCompareIgnoreCase(this.hasMultiCarers, 'true')) {
        throw new Error('451');
      }
    }

    if (!_.isEmpty(relatedCarers)) {
      this.relatedCarers = relatedCarers;
    } else {
      log.info('debug, relatedCarers not populated');
    }
  }

  _hasMultipleCarers(noOfCarers) {
    if (
      utils.stringCompareIgnoreCase('Carer', this.sub_userType) &&
      utils.stringCompareIgnoreCase('Carer', this.obj_userType)
    ) {
      return 'NA';
    } else if (utils.stringCompareIgnoreCase('Recipient', this.obj_userType)) {
      if (noOfCarers > 1) {
        return 'true';
      } else {
        return 'false';
      }
    }
  }

  _getRelatedInfo(relatedAccounts) {
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
}

module.exports = SubjectRelation;
