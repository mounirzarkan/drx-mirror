import React from 'react';
import DetailActionBar from '../components/Shared/DetailActionBar/DetailActionBar';

export default function renderDetailActionBar(
  config,
  data,
  isEdit,
  onHandle,
  labels,
  errorMode,
  routerLink,
) {
  // TODO refactor
  let title = '';

  if (labels[config?.title]?.indexOf('{{name}}') !== -1) {
    if (data && data[config?.titleData]?.value) {
      title = labels[config?.title]?.replace(
        '{{name}}',
        (data && data[config?.titleData]?.value) || '',
      );
    } else {
      title = labels[config?.fallbackTitle] || '';
    }
  } else {
    title = labels[config?.title];
  }

  if (config?.mode === 'readWrite') {
    if (isEdit === config?.id) {
      return (
        <DetailActionBar
          id="cancel"
          data-nw-state="edit"
          buttonHandle={onHandle}
          buttonIconType="close"
          buttonText={labels[config?.edit?.cancel]}
          cssModifier="highlight"
          title={title}
          mode="edit"
          routerLink={routerLink}
        />
      );
    }
    return (
      <DetailActionBar
        id="edit"
        data-nw-state="read"
        buttonHandle={onHandle}
        buttonIconType="edit"
        buttonText={labels[config?.edit?.edit]}
        title={title}
        mode="read"
        routerLink={routerLink}
        hideButton={
          !!(isEdit && isEdit !== config?.id) || errorMode !== ''
        }
      />
    );
  }
  return (
    <DetailActionBar
      hideButton
      title={title}
      mode="read"
      data-nw-state="read"
      routerLink={routerLink}
    />
  );
}
