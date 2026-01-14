export default function mapListConfig(
  config,
  focusName,
  onErrorHandle,
  mask,
) {
  // TODO isRequired needs to passed down
  return {
    ...config,
    read: {
      ...config.read,
      onErrorHandle,
      mask,
      isRequired: true,
      id: config.id,
      country: config.country,
    },
    edit: {
      ...(config?.edit || {}),
      focusName,
      country: config.country,
    },
  };
}
