export default function(lbs) {
  const labels2 = {};
  lbs.children.forEach(list => {
    list.children.forEach(element => {
      labels2[element.key.value] = element.value.value;
    });
  });

  return labels2;
}
