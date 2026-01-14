import mapValidator from './mapValidator';

function mapEditFields(children) {
  const obj = children?.map(x => {
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
  return obj;
}

export default function (
  addressView,
  gqlConfig,
  countryStates,
  onErrorHandle,
  labels,
) {
  const commonLabels = {
    hint: gqlConfig.data?.settings?.hint?.targetItem?.field?.value,
    label: gqlConfig.data?.settings?.label?.targetItem?.field?.value,
    optional:
      gqlConfig.data?.settings?.optional?.targetItem?.field?.value,
    addressNotFoundButton:
      gqlConfig.data?.settings?.addressNotFoundButton?.targetItem
        ?.field?.value,
    addressNotFoundText:
      gqlConfig.data?.settings?.addressNotFoundText?.targetItem?.field
        ?.value,
    loading:
      gqlConfig.data?.settings?.loading?.targetItem?.field?.value,
    lookupErrorLabel:
      gqlConfig.data?.settings?.lookupErrorLabel?.targetItem?.field
        ?.value,
    prompt:
      gqlConfig.data?.settings?.prompt?.targetItem?.field?.value,
    promptMobile:
      gqlConfig.data?.settings?.promptMobile?.targetItem?.field
        ?.value,
    clkErrorLabel:
      gqlConfig.data?.read?.clkErrorLabel?.targetItem?.field?.value,
    errorLabel:
      gqlConfig.data?.read?.errorLabel?.targetItem?.field?.value,
  };

  const countryName = gqlConfig.data?.settings?.countryName?.value;

  return {
    additionalConfig: {
      addressMaintenanceConfig: {
        countryName: countryName,
        submissionModel: addressView?.submissionModel,
        submissionUrl: addressView?.submissionUrl,
        onEditHandle: function onEditHandle2(props) {
          console.log('mapAddress Config onEditHandle: ', props);
        },
        onErrorHandle: onErrorHandle,
        onFormDataChangedHandle: function onFormDataChangedHandle(
          props,
        ) {
          console.log(
            'mapAddress Config onFormDataChangedHandle: ',
            props,
          );
        },
        listView: {
          useScContent: true,
          onAddHandle: () => {},
          format: gqlConfig.data?.read?.children[0]?.value?.value,
          type: 'composite',
          validators:
            gqlConfig?.data?.read?.children[0].validators?.map(x =>
              mapValidator(x),
            ),
          showAdd: true,
          contextMenu: [
            {
              text: labels[
                gqlConfig.data?.settings?.listChangeLink?.targetItem
                  ?.field?.value
              ],
              onclick: () => {},
            },
          ],
        },
        singleEntryView: {
          currentCountry: addressView.country,
          showHeader: true,
          showLogo: true,
          logoSrc:
            'https://assets.cochlear.com/api/public/content/9b0fe6edfab24f30aacb335a2def7db0?v=31f4cd51',
          logoAlt: 'Cochlear',
          showFooter: true,
          disabledCountryOption: ['AF', 'AE', 'AD'],
          lockCountry: true,
          addressGeneralConfig: {
            timer: 4000,
            mode: 'drx',
            cancel: addressView.edit?.cancelLabel,
            save: addressView.edit?.saveLabel,
            copyright: addressView.edit?.copyright,
            country: addressView.edit?.country,
            changeAddress: addressView.edit?.changeAddress,
            addAddress: addressView.edit?.addAddress,
            setDefault: addressView.edit?.setDefault,
            languageCode: addressView.language?.toUpperCase(),
            addressInputConfig: {
              id: 'addressInput',
              name: 'addressInput',
              ...commonLabels,
              config: {
                disabled: false,
                onSaveHandle: () => {
                  // not required as form values captured inside addressGeneralConfig
                },
                onSaveErrorHandle: response => {
                  console.log('🚀 ~ response:', response);
                },
                cancelLabel: addressView.edit?.cancelLabel,
                saveLabel: addressView.edit?.saveLabel,
                savedLabel: addressView.edit?.savedLabel,
                savingLabel: addressView.edit?.savingLabel,
                labels: {
                  ...commonLabels,
                },
                country: addressView.country,
                searchCharLength: parseInt(
                  gqlConfig.data?.settings?.searchCharLength?.value,
                ),
                fields: [
                  ...mapEditFields(gqlConfig?.data?.edit?.children),
                ],
                cityState: gqlConfig.data?.settings?.cityState?.value,
                cancel: addressView.edit?.cancel,
                addressAPIState: {
                  addressAPIStateTypeId:
                    addressView.addressAPIStateTypeId,
                  addressAPIStateName:
                    addressView.addressAPIStateName,
                },
                countryStates: countryStates,
              },
            },
            disabled: false,
            fieldsItems: [
              ...mapEditFields(
                gqlConfig?.data?.editDefault?.children,
              ),
            ],
            // this is locked, so we only show the current country
            customData: [
              {
                label: countryName,
                value: addressView.country,
              },
            ],
          },
        },
        labels: {
          add: gqlConfig.data?.list?.add?.targetItem?.key?.value,
          address:
            gqlConfig.data?.list?.address?.targetItem?.key?.value,
          addressList:
            gqlConfig.data?.list?.addressList?.targetItem?.key?.value,
          billing:
            gqlConfig.data?.list?.billing?.targetItem?.key?.value,
          mailing:
            gqlConfig.data?.list?.mailing?.targetItem?.key?.value,
          shipping:
            gqlConfig.data?.list?.shipping?.targetItem?.key?.value,
          modalBody:
            gqlConfig.data?.modal?.modalBody?.targetItem?.key?.value,
          modalCancel:
            gqlConfig.data?.modal?.modalCancel?.targetItem?.key
              ?.value,
          modalDelete:
            gqlConfig.data?.modal?.modalDelete?.targetItem?.key
              ?.value,
          modalTitle:
            gqlConfig.data?.modal?.modalTitle?.targetItem?.key?.value,
        },
      },
    },
    cancelLabel: addressView.cancelLabel,
    createIcon: addressView.createIcon,
    createLabel: addressView.createLabel,
    data: addressView.data,
    edit: {
      cancel: addressView.edit?.cancel,
      cancelLabel: addressView.edit?.cancelLabel,
      cityState: gqlConfig.data?.settings?.cityState?.value,
      country: addressView.country,
      edit: addressView.edit?.edit,
      fields: mapEditFields(gqlConfig.data?.edit?.children),
      labels: {
        ...commonLabels,
      },
      saveLabel: addressView.edit?.saveLabel,
      savedLabel: addressView.edit?.savedLabel,
      savingLabel: addressView.edit?.savingLabel,
      searchCharLength: parseInt(
        gqlConfig.data?.settings?.searchCharLength?.value,
      ),
      // submissionModel: addressView?.submissionModel,
      // submissionUrl: addressView?.submissionUrl,
    },
    editLabel: addressView.editLabel,
    errorMode: 'read',
    id: addressView.id,
    isEdit: '',
    mode: addressView.mode,
    title: addressView.title,
    type: addressView.type,
  };
}
