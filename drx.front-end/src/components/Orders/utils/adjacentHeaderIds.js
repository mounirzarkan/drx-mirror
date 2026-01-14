export default function adjacentHeaderIds(currentId, list) {
  const index = list.findIndex(
    item => item.toString() === currentId.toString(),
  );
  let prev;
  let next;
  if (list && list.length > 1 && index >= 0) {
    if (index - 1 >= 0) {
      prev = list[index - 1];
    } else {
      prev = list[list.length - 1];
    }
    if (index + 1 < list.length) {
      next = list[index + 1];
    } else {
      next = list[0];
    }
  }
  return { prev, next };
}
