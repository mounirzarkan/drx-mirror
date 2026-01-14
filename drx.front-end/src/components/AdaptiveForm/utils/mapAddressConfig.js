import mapValidator from './mapValidator';

function mapEditFields(children) {
  const test = children?.map(x => {
    return {
      id: x.name,
      name: x.name,
      type: x.type.value,
      label: x.label?.targetItem?.field.value,
      apifield: x.apiField?.targetItem?.field.value,
      promptText: `${x.promptText?.targetItem?.field.value}`,
      optionalText: `${x.optionalText?.targetItem?.field.value}`,
      hint: `${x.hint?.targetItem?.field.value}`,
      validators: x.validators.map(v => {
        return {
          apifield: x.apiField?.targetItem?.field.value,
          name: v.name,
          type: v.type.value,
          key: v.key?.value,
          message: v.message?.targetItem?.field?.value,
        };
      }),
    };
  });
  return test;
}

export default function (
  gql,
  country,
  postcode,
  name,
  regionsUrl,
  addressConfig,
  loadError,
  saveProgress,
  onErrorHandle,
) {
  if (!gql) return null;

  const myConf = {
    mode: addressConfig?.mode,
    title: addressConfig?.title,
    edit: {
      submissionModel: addressConfig?.edit?.submissionModel,
      submissionUrl: addressConfig?.edit?.submissionUrl,

      saveLabel: addressConfig?.edit?.saveLabel,
      cancelLabel: addressConfig?.edit?.cancelLabel,
      savingLabel: addressConfig?.edit?.savingLabel,
      savedLabel: addressConfig?.edit?.savedLabel,

      labels: {
        optional:
          gql?.data?.settings?.optional?.targetItem?.field?.value,
        prompt: gql?.data?.settings?.prompt?.targetItem?.field?.value,
        promptMobile:
          gql?.data?.settings?.promptMobile?.targetItem?.field?.value,
        loading:
          gql?.data?.settings?.loading?.targetItem?.field?.value,
        addressNotFoundText:
          gql?.data?.settings?.addressNotFoundText?.targetItem?.field
            ?.value,
        addressNotFoundButton:
          gql?.data?.settings?.addressNotFoundButton?.targetItem
            ?.field?.value,
        lookupErrorLabel:
          gql?.data?.settings?.lookupErrorLabel?.targetItem?.field
            ?.value,
      },
      country,
      postcode,
      searchCharLength: parseInt(
        gql?.data?.settings?.searchCharLength?.value,
      ),
      swapEditDisplayOrder:
        gql?.data?.settings?.swapEditDisplayOrder?.boolValue || false,
      name,
      fields: mapEditFields(gql?.data?.edit?.children),
      cityState: gql?.data?.settings?.cityState?.value,
      regionsUrl,
      edit: addressConfig?.edit?.edit,
      cancel: addressConfig?.edit?.cancel,
      googleMapsLoadError: loadError,
    },
    read: {
      label: {
        format: gql?.data?.read?.children[0].value.value,
        type: 'composite',
        validators: gql?.data?.read?.children[0].validators?.map(x =>
          mapValidator(x),
        ),
      },
      onErrorHandle,
    },
  };

  return myConf;
}
