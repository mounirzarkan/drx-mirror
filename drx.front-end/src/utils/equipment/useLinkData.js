import axios from 'axios';
import getCountryCochlearCom from '../getCountryCochlearCom';
import { fetchDevicesDetails } from '../../utils/equipment/fetchDevicesDetails';
import config from '../../config';

const {
  gqlUrlToken,
  graphQLEndpoint,
  sitecoreApiHost,
  deviceSupport,
  cochlearDotCom,
} = config;

const DEVICES_URL = `${sitecoreApiHost}${graphQLEndpoint}`;
const AUTH_TOKEN = gqlUrlToken;

const fetchDeviceByName = async (devicesDetails, detailData) => {
  if (devicesDetails) {
    const match = devicesDetails.find(
      ({ name }) =>
        name.toLowerCase() === detailData?.deviceName.toLowerCase(),
    );
    return match;
  }
  return false;
};

const fetchDeviceLinks = async (
  deviceByModel,
  serviceRequest,
  countryCode,
  lang,
) => {
  if (deviceByModel) {
    // only called if linkObj exists
    const deviceLinks = [];

    // first build links specific to user country & lang
    const country = getCountryCochlearCom(countryCode);

    // if this country has access to device support, then get link if it exists
    const getSupport =
      serviceRequest.boolValue && deviceByModel?.deviceSupport?.value;

    // create the relative path with user country and language
    // prepend the device support domain (for this environment)
    if (getSupport) {
      const buildSupportPath = `${deviceSupport}${country}/${lang}${getSupport}`;
      deviceLinks.push({
        name: 'deviceSupport',
        value: buildSupportPath,
      });
    }

    const getInfo = deviceByModel?.productInfo?.value;

    // if it exists, create the relative path with user country and language
    // prepend the cochlear.com domain (for this environment)

    if (getInfo) {
      const buildInfoPath = `${cochlearDotCom}/${country}/${lang}${getInfo}`;
      deviceLinks.push({
        name: 'productInfo',
        value: buildInfoPath,
      });
    }
    return deviceLinks;
  }
};

const fetchCheckedLinks = async link => {
  if (link) {
    try {
      let response = await axios.get(link.value, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return response;
      }
      return false;
    } catch (error) {
      // ENABLE WHEN DEBUGING
      // if (error.response) {
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.log(
      //     'URL does not exist. Status code:',
      //     error.response.status,
      //   );
      // } else if (error.request) {
      //   // The request was made but no response was received
      //   console.log('No response received:', error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log('Error', error.message);
      // }
      return false;
    }
  }
};

const checkedLinks = async deviceLinks => {
  const promises = deviceLinks.map(async deviceLink => {
    const linkExists = await fetchCheckedLinks(deviceLink);
    return linkExists ? deviceLink : {};
  });
  const links = await Promise.all(promises);
  return links;
};

export async function UseLinkData(
  detailData,
  serviceRequest,
  countryCode,
  lang,
) {
  // product meta details from SC (/sitecore/content/drx/Products meta) stored in session storage
  const devicesDetails = await fetchDevicesDetails(
    DEVICES_URL,
    AUTH_TOKEN,
  );

  const deviceByName = await fetchDeviceByName(
    devicesDetails,
    detailData,
  );

  if (deviceByName) {
    const deviceLinks = await fetchDeviceLinks(
      deviceByName,
      serviceRequest,
      countryCode,
      lang,
    );
    const res = await checkedLinks(deviceLinks);
    return res;
  }

  return [];
}
