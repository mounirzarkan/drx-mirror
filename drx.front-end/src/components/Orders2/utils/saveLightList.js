import createLightList from './createLightList';
import getLightList from './getLightList';

export default function saveLightList(
  isOrderDetails,
  data,
  userId,
  lightListProp,
  prefix,
) {
  let lightList = [];

  if (isOrderDetails) {
    lightList = getLightList(data, userId, lightListProp, prefix);
  } else {
    lightList = createLightList(data, lightListProp);
  }
  window.sessionStorage.setItem(
    prefix + userId,
    JSON.stringify(lightList),
  );
  return lightList;
}
