import lodash from 'lodash';

function mapToolbar(labels, handleDataQuery, deviceName) {
  return [
    {
      align: 'left',
      icon: '',
      sections: [
        {
          action: () => {
            handleDataQuery(null, 'actions.details.navigateBack', {});
          },
          text: labels['labels.equipement.details.toolbar.equipment'],
        },
        {
          action: function noRefCheck() {},
          text: deviceName || '',
        },
      ],
      type: 'breadcrumb',
    },
  ];
}

function mapLinks(labels, toolbarLinks) {
  const linkDefaults = {
    align: 'right',
    disabled: false,
    icon: 'linkout',
    iconAlign: 'right',
    type: 'hyperlink',
  };

  const links = [];
  toolbarLinks.map(l => {
    if (!lodash.isEmpty(l)) {
      return links.push({
        ...linkDefaults,
        linkTo: l.value,
        text:
          labels['labels.equipement.details.toolbar.' + l.name + ''],
      });
    }
  });
  // sort aplhabetically by link name
  const myOrderedLinks = lodash.sortBy(links, i => i.name);
  return myOrderedLinks;
}

export const mapDetailConfig = (
  labels,
  handleDataQuery,
  detailData,
  toolbarLinks = [], // empty array by default
) => {
  const links =
    toolbarLinks.length > 0 ? mapLinks(labels, toolbarLinks) : [];

  return {
    toolbar: {
      items: mapToolbar(
        labels,
        handleDataQuery,
        detailData?.deviceName,
      ),
      links,
      dropdown: {
        showDropdown: toolbarLinks.length > 0,
        visible: 'sm',
      },
    },
  };
};
