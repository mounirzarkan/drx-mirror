export default function mapAccountConfig(
  config,
  focusName,
  onErrorHandle,
) {
  return {
    ...config,
    read: { ...config.read, onErrorHandle },
    edit: { ...(config?.edit || {}), focusName },
  };
}
