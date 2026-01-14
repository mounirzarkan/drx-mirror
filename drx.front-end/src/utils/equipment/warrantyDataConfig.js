export const warrantyDataConfig = (dataItem, type) => {
  const apiField = dataItem?.warranty[0]?.apiField?.targetItem?.name;
  const abbrSingleYear =
    dataItem?.warranty[0]?.abbrSingleYear?.targetItem?.key?.value;
  const abbrPluralYear =
    dataItem?.warranty[0]?.abbrPluralYear?.targetItem?.key?.value;
  const singleYear =
    dataItem?.warranty[0]?.singleYear?.targetItem?.key?.value;
  const pluralYear =
    dataItem?.warranty[0]?.pluralYear?.targetItem?.key?.value;
  const abbrSingleMonth =
    dataItem?.warranty[0]?.abbrSingleMonth?.targetItem?.key?.value;
  const abbrPluralMonth =
    dataItem?.warranty[0]?.abbrPluralMonth?.targetItem?.key?.value;
  const singleMonth =
    dataItem?.warranty[0]?.singleMonth?.targetItem?.key?.value;
  const pluralMonth =
    dataItem?.warranty[0]?.pluralMonth?.targetItem?.key?.value;
  const singleDay =
    dataItem?.warranty[0]?.singleDay?.targetItem?.key?.value;
  const pluralDay =
    dataItem?.warranty[0]?.pluralDay?.targetItem?.key?.value;

  const warrantyOptions = dataItem?.warranty[0]?.warrantyOptions
    ?.filter(({ name }) => name === type)[0]
    ?.options.map(({ option, value }) => {
      return {
        option: `actions.grouping.${option?.targetItem?.name}`,
        ...(value?.targetItem?.key?.value
          ? { value: value?.targetItem?.key?.value }
          : {}),
      };
    });
  return {
    apiField,
    abbrSingleYear,
    abbrPluralYear,
    singleYear,
    pluralYear,
    abbrSingleMonth,
    abbrPluralMonth,
    singleMonth,
    pluralMonth,
    singleDay,
    pluralDay,
    warrantyOptions,
  };
};
