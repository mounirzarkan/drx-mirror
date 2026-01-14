import { mapErrorConfig } from '../../../utils/error/mapErrorConfig';
import mapValidator from './mapValidator';
import phoneCountryList from './phoneCountryList';

export function mapTabScenarios(
  locale,
  country,
  scData,
  mode,
  errorStatus,
  handleErrorCallback,
  labels,
) {
  const lng = locale;

  // filter out scenarios that are a match for the user country and exist in a shared library
  // eg; PR is included in the US library for adaptive form
  const filteredTabConfigs = scData.tabConfigs.filter(
    f =>
      f.userCountry?.value?.toLowerCase() === country.toLowerCase(),
  );
  scData.tabConfigs = filteredTabConfigs;

  const scScenarios = {
    formConfig: {
      tabConfigs: scData.tabConfigs?.map(x =>
        mapSingleScenario(country, lng, x, scData),
      ),
      errorModes: mapErrorConfig(
        scData.errorModes[0].children,
        mode,
        errorStatus,
        handleErrorCallback,
        labels,
      ),
    },
  };

  return scScenarios;
}

export function mapSingleScenario(country, lng, scData, scRoot) {
  return {
    name: scData.name,
    tabType: scData.tabType?.value?.toLowerCase(),
    userType: scData.userType?.value?.toLowerCase(),
    userAgeGroup: scData.userAgeGroup?.value?.toLowerCase(),
    addressRestricted: scData.addressRestricted?.boolValue,
    hasCarer: scData.hasCarer?.boolValue,
    sections: scData.sections.map(x =>
      mapSection(country, lng, x, scRoot),
    ),
  };
}

export function mapSection(country, lng, scData, scRoot) {
  let obj = {
    country,
    language: lng,
    mask: scRoot.dateMask?.value,
    id: scData.Id?.value,
    title: scData.title?.targetItem?.value?.value,
    fallbackTitle: scData.fallbackTitle?.targetItem?.value?.value,
    type: scData.type?.value,
    mode: scData.mode?.value,
    data: scData.data?.value,
    editLabel: scRoot.editLink?.targetItem?.value?.value,
    cancelLabel: scRoot.cancelLink?.targetItem?.value?.value,
    createLabel: scRoot.createLink?.targetItem?.value?.value,
    createIcon: scRoot.createIcon?.value,
    read: mapReadState(
      scData?.states?.filter(x => x.name === 'read')[0],
    ),
    edit: mapEditState(
      country,
      lng,
      scData?.states?.filter(x => x.name === 'edit')[0],
      scData,
      scRoot,
    ),
  };

  if (obj.type?.toLowerCase() === 'personal') {
    obj = {
      ...obj,
      titleData: 'firstName',
    };
  }

  if (
    obj.type?.toLowerCase() === 'address' ||
    obj.type?.toLowerCase() === 'addressmaintenance'
  ) {
    obj = {
      ...obj,
      submissionUrl: scData.submissionUrl?.value,
      submissionModel: scData.submissionModel?.value,
      addressAPIStateTypeId:
        scRoot?.addressAPIStateTypeId?.value || undefined,
      addressAPIStateName:
        scRoot?.addressAPIStateName?.value || undefined,
    };
  }

  if (obj.type?.toLowerCase() === 'contact') {
    obj = {
      ...obj,
    };
  }

  return obj;
}

export function mapReadState(scData) {
  if (scData === undefined) return {};
  return {
    name: scData.name,
    clkErrorLabel: scData.clkErrorLabel?.targetItem?.field?.value,
    errorLabel: scData.errorLabel?.targetItem?.field?.value,
    inlineErrors: true,
    elements: scData.elements
      ?.filter(x => x.template?.name === 'ReadField Element')
      .map(x => mapElement(x)),
    fields: scData.elements
      ?.filter(x => x.template?.name === 'ReadField Field')
      .map(x => mapField(x)),
  };
}

export function mapEditState(
  country,
  lng,
  scData,
  scSection, // Form section specific
  scRoot, // adaptive form specific
) {
  let obj = {
    saveLabel: scRoot.saveButton?.targetItem?.value?.value,
    cancelLabel: scRoot.cancelButton?.targetItem?.value?.value,
    savingLabel: scRoot.saving?.targetItem?.value?.value,
    savedLabel: scRoot.saved?.targetItem?.value?.value,
    edit: scRoot.editLink?.targetItem?.value?.value,
    editIcon: scRoot.editIcon?.value,
    cancel: scRoot.cancelLink?.targetItem?.value?.value,
    title: scSection.title?.targetItem?.value?.value,
    fallbackTitle: scSection.fallbackTitle?.targetItem?.value?.value,
    submissionUrl: scSection.submissionUrl?.value,
    submissionModel: scSection.submissionModel?.value,
    addAddress: scRoot.addAddress?.targetItem?.value?.value,
    changeAddress: scRoot.changeAddress?.targetItem?.value?.value,
    copyright: scRoot.copyright?.targetItem?.value?.value,
    country: scRoot.country?.targetItem?.value?.value,
    setDefault: scRoot.setDefault?.targetItem?.value?.value,
    mask: scRoot.dateMask.value,
    useLiveValidation: true,
    showInitialErrors: true,
    timer: 4000,
  };

  if (scData !== undefined) {
    obj.elements = scData.elements
      ?.filter(x => x.template?.name === 'EditField Element')
      .map(x => mapElement(x));
  }
  if (
    scSection.type?.value?.toLowerCase() === 'list' ||
    scSection.type?.value?.toLowerCase() === 'contactlist' ||
    (scSection?.Id?.value.toLowerCase() === 'contactview' &&
      scSection?.type?.value.toLowerCase() === 'form')
  ) {
    // pass checkbox label to the edit mobile element
    if (obj.elements?.filter(x => x.apifield === 'mobilePhone')[0]) {
      obj.elements.filter(
        x => x.apifield === 'mobilePhone',
      )[0].ocSmsLabel =
        scData?.smsInformation?.targetItem?.field?.value;
    }

    obj = {
      ...obj,
      smsInformation:
        scData?.smsInformation?.targetItem?.field?.value,
      phoneLabel: scData?.phoneLabel?.targetItem?.field?.value,
      phonePromptText:
        scData?.phonePromptText?.targetItem?.field?.value,
      countryLabel: scData?.countryLabel?.targetItem?.field?.value,
      countryPromptText:
        scData?.countryPromptText?.targetItem?.field?.value,
      nationalNumberLabel:
        scData?.nationalNumberLabel?.targetItem?.field?.value,
      preferredLabel:
        scData?.preferredLabel?.targetItem?.field?.value,
      ocSmsLabel: scData?.ocSmsLabel?.targetItem?.field?.value,
      noOptionsMessage:
        scData?.noOptionsMessage?.targetItem?.field?.value,
      showOcSms: scData?.elements[0]?.showOCSMS?.boolValue,
      showPreferred: scData?.elements[0]?.useShowPreferred?.boolValue,
      phoneNumberLength:
        scData?.elements[0]?.phoneNumberLength?.value,
      useStrictMode: scData?.elements[0]?.useStrictMode?.boolValue,
    };
  }
  return obj;
}

export function getPhoneTypes(scSection) {
  const editState = scSection.states.filter(
    x => x.name === 'edit',
  )[0];
  const phoneNumber = editState?.elements.filter(
    x => x.type.value.toLowerCase() === 'phonenumber',
  )[0];
  const types = phoneNumber?.validators
    ?.filter(x => x.template?.name !== 'FieldValidator')
    .map(x => {
      return {
        value: x.value.value,
        label: x.label.value,
      };
    });

  return types;
}

export function mapElement(scData) {
  let obj = {
    id: scData.name,
    text: scData.text?.targetItem?.field?.value,
    label: scData.label?.targetItem?.field?.value,
    value: scData.value?.value,
    apifield: scData.apiField?.value,
    visible: scData.visible?.value || undefined,
  };

  if (scData.template?.name === 'EditField Element') {
    obj = {
      id: scData.name,
      text: scData.text?.targetItem?.field?.value,
      label: scData.label?.targetItem?.field?.value,
      value: scData.value?.value,
      apifield: scData.apiField?.targetItem?.name,
      type: scData.type?.value?.toLowerCase(),
      placeholder: scData.placeholder?.targetItem?.field?.value,
      placeholderForCode:
        scData.placeholderForCode?.targetItem?.field?.value,
      optionalText: scData.optionalLabel?.targetItem?.field?.value,
      hint: scData.hint?.targetItem?.field?.value,
      hintForCode: scData.hintForCode?.targetItem?.field?.value,
      defaultValue: scData.defaultValue?.targetItem?.value,
      format: scData.format?.value,
      dateFormat: scData.dateFormat?.targetItem?.name?.toLowerCase(),
      hidden: scData.hidden?.boolValue,
      countryList: phoneCountryList,
    };
  }

  if (obj.type === 'phonenumber') {
    obj.phoneNumberLength = parseInt(scData.phoneNumberLength?.value);
    obj.useStrictMode = scData.useStrictMode?.boolValue;
    obj.stateManaged = true;
    obj.showOcSms = scData.showOCSMS?.boolValue;
    obj.showPreferred = scData.useShowPreferred?.boolValue;
  }

  obj.validators = scData.validators
    ?.filter(x => x.template?.name === 'FieldValidator')
    .map(x => mapValidator(x));

  return obj;
}

export function mapField(scData) {
  return {
    name: scData.name,
    text: scData.text?.targetItem?.field?.value,
  };
}
