// mapTabsConfig(labels,sid,userId,userList)
export const mapTabsConfig = (labels, sid, userId, userList) => {
  return {
    accountId: sid,
    userId,
    labels: {
      promptText: labels['labels.tabs.promptText'],
      promptTextAbbrv: labels['labels.tabs.promptTextAbbrv'],
      type: labels['labels.tabs.tab2Type'],
    },
    tabs: userList,
  };
};
