import lodash from 'lodash';
import createLightList from './createLightList';

export default function getLightList(
  orderList,
  userId,
  lightListProp,
  prefix,
) {
  const newLightList = createLightList(orderList, lightListProp);
  const sessionLightListStr = window.sessionStorage.getItem(
    prefix + userId,
  );
  if (sessionLightListStr) {
    const sessionLightList = JSON.parse(sessionLightListStr);
    if (
      sessionLightList.length === newLightList.length &&
      lodash.difference(sessionLightList, newLightList).length === 0
    ) {
      return sessionLightList;
    }
  }
  return newLightList;
}
