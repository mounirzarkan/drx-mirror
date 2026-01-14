export default function mapContactEditConfig(config, labels) {
  return {
    ...config,
    smsInformation: labels[config.smsInformation],
    phoneLabel: labels[config.phoneLabel],
    phonePromptText: labels[config.phonePromptText],
    countryLabel: labels[config.countryLabel],
    countryPromptText: labels[config.countryPromptText],
    nationalNumberLabel: labels[config.nationalNumberLabel],
    preferredLabel: labels[config.preferredLabel],
    ocSmsLabel: labels[config.ocSmsLabel],
    noOptionsMessage: labels[config.noOptionsMessage],
  };
}
