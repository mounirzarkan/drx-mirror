export const getActiveFilter = getFilterValue => {
  switch (getFilterValue) {
    case 'Accessory':
    case 'Accessory,Remote Assistant':
      return {
        icon: 'accessories',
        mobileColumnLabel:
          'labels.equipement.toolbars.list.accessories',
      };
    case 'Sound Processor':
      return {
        icon: 'sound-processor-a',
        mobileColumnLabel:
          'labels.equipement.toolbars.list.processors',
      };
    case 'implant':
      return {
        icon: 'cochlear-implant',
        mobileColumnLabel: 'labels.equipement.toolbars.list.implants',
      };
    default:
      return {
        icon: 'apps',
        mobileColumnLabel: 'labels.equipement.toolbars.list.all',
      };
  }
};
