export default (eventType, eventName, itemType, itemName) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Cochlear DataLayer Event',
      action: {
        eventType,
        eventName,
      },
      component: {
        itemType,
        itemName,
      },
      user: {
        profileInfo: {
          isLoggedIn: 'true',
        },
      },
    });
  }
};
