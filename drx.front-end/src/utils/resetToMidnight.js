export default function resetToMidnight(d) {
  const dateFormat = new Date(d);
  dateFormat.setMinutes(
    dateFormat.getMinutes() + dateFormat.getTimezoneOffset(),
  );
  return dateFormat.getTime();
}
