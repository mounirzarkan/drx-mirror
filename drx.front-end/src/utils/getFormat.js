export default function getFormat(mask) {
  let config = {};
  switch (mask) {
    case 'DD MMM YYYY':
    case 'MMM DD YYYY':
    case 'YYYY MMM DD':
      config = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
      break;
    case 'DD MMMM YYYY':
    case 'MMMM DD YYYY':
    case 'YYYY MMMM DD':
      config = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      };
      break;
    default:
      config = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      };
  }

  return config;
}
