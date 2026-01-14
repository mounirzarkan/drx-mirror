// get minutes from now in a date instance
export default function getMinutes(minutes) {
  return new Date(new Date().getTime() + minutes * 60 * 1000);
}
