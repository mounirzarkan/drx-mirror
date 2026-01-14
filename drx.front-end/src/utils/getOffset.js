// get element offset in relation to the document
export default function getOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft =
    window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}
