export default function createLightList(orderList, lightListProp) {
  return orderList.reduce((acc, order) => {
    if (order && order[lightListProp]) {
      acc.push(order[lightListProp]);
    }
    return acc;
  }, []);
}
