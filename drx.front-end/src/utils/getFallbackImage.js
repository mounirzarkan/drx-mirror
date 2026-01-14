import { getHtmlAttributes } from './_helpers/html';

// pass the device type and the fallback images object to return the image source
export default function getFallbackImage(type, images) {
  let img = {};
  let fallback;
  switch (type) {
    case 'implant':
    case 'Implant':
      fallback = images.find(({ name }) => name === 'Implant');
      img = getHtmlAttributes(fallback.image.value, 'image', ['src']);
      break;
    case 'soundProcessors':
    case 'Sound Processor':
      fallback = images.find(
        ({ name }) => name === 'Sound Processor',
      );
      img = getHtmlAttributes(fallback.image.value, 'image', ['src']);
      break;
    default:
      // default to accessories
      fallback = images.find(({ name }) => name === 'Accessory');
      img = getHtmlAttributes(fallback.image.value, 'image', ['src']);
  }
  return img.src;
}
