import axios from 'axios';

// fetch product meta data
export const fetchDevicesDetails = async (devicesUrl, authToken) => {
  const qData = JSON.stringify({
    query: `
  {
    item(path: "/sitecore/content/drx/product meta"){
         products : children{
              name,
              productInfo: field(name: "product info") {
                  value
             }
              deviceSupport: field(name: "device support") {
                  value
             }
              productName: field(name: "product name") {
                  value
             }
              productType: field(name: "product type") {
                  value
             }
              friendlyName: field(name: "friendly name") {
                  value
             }
              friendlyImage: field(name: "image") {
                  value
             }
         }
    }
  }
  `,
  });

  const preloadedData = sessionStorage.getItem('productsData');

  if (!preloadedData) {
    try {
      const response = await axios.post(devicesUrl, qData, {
        headers: {
          Authorization: `Basic ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const json = response.data.data.item.products;
      sessionStorage.setItem('productsData', JSON.stringify(json));

      return json;
    } catch (err) {
      throw new Error('Unable to get equipment data');
    }
  } else {
    // set state with the result if `isSubscribed` is true
    return JSON.parse(preloadedData);
  }
};
