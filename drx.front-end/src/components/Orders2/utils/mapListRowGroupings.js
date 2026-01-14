export default function mapListRowGroupings(groups) {
  let groupsArray = [];
  groupsArray = groups.map((group, index) => {
    return {
      display: group?.label?.targetItem?.key.value,
      option: `actions.grouping.${group?.option?.targetItem?.name}`,
      order: index + 1,
    };
  });

  return groupsArray;
}
