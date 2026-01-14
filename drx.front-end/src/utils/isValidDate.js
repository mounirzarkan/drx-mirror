export default function isValidDate(d) {
  // eslint-disable-next-line no-restricted-globals
  return d instanceof Date && !isNaN(d);
}
