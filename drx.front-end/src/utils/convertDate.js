import dateFormat from 'dateformat';
import isValidDate from './isValidDate';

export default function convertDate(data, config) {
  const { mask } = config;
  const d = new Date(data);

  // Methods on Date Object will convert from UTC to users timezone
  // Set minutes to current minutes (UTC) + User local time UTC offset
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return isValidDate(d) && dateFormat(d, mask);
}
