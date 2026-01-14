export default function findActiveScenario(
  userAboutMe,
  scenarios,
  config,
) {
  const tabConfig = scenarios?.formConfig?.tabConfigs?.find(
    ({
      userType: targetUserType,
      tabType,
      userAgeGroup,
      addressRestricted,
      hasCarer,
    }) => {
      return userAboutMe.isScenarioApplicable(
        targetUserType,
        tabType,
        userAgeGroup,
        addressRestricted,
        hasCarer,
      );
    },
  );

  if (tabConfig?.sections?.length > 0) {
    const name = tabConfig.name;
    const sections = tabConfig?.sections?.reduce((acc, section) => {
      acc[section.id] = section;
      return acc;
    }, {});

    return {
      ...config,
      ...sections,
      errorView: scenarios.formConfig.errorModes,
      name,
    };
  }

  return config;
}
