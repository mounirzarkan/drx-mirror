import axios from 'axios';
import appConfig from '../../config';
const { drxMain, graphQLEndpoint } = appConfig;
const gqlUrl = `${drxMain}${graphQLEndpoint}`;

function fetchData(url, token, query) {
  const gql = axios({
    method: 'post',
    url,
    headers: {
      Authorization: token && `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    data: query,
  });
  return gql;
}

export const getSingleViewContent = (token, country, language) => {
  const path = `/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Service Requests/Default/Single view`;
  // GQL query to return the labels for the request section
  const queryData1 = JSON.stringify({
    query: `{
    labels: item(path: "${path}/Labels", language: "${language}") {
      requestTitle: field(name: "Request title") {
        ...KeyValue
      }
      requestId: field(name: "Request id") {
        ...KeyValue
      }
      requestStatus: field(name: "Status") {
        ...KeyValue
      }
      requestCreatedOn: field(name: "Created on") {
        ...KeyValue
      }
      requestClinic: field(name: "Clinic") {
        ...KeyValue
      }
      requestProblem: field(name: "Problem") {
        ...KeyValue
      }
    }
  }
  
  fragment KeyValue on ReferenceField {
    targetItem {
      key: field(name: "Key") {
        value
      }
    }
  }
  `,
  });

  // GQL query to return the labels for the device section
  const queryData2 = JSON.stringify({
    query: `{
    labels: item(path: "${path}/Labels", language: "${language}") {
      deviceTitle: field(name: "Device title") {
        ...KeyValue
      }
      devicePartNo: field(name: "Part no") {
        ...KeyValue
      }
      deviceTypeProcessor: field(name: "Type processor") {
        ...KeyValue
      }
      deviceTypeAccessory: field(name: "Type accessory") {
        ...KeyValue
      }      
      deviceActivated: field(name: "Activated") {
        ...KeyValue
      }
      deviceWarranty: field(name: "Warranty") {
        ...KeyValue
      }
      deviceWarrantyTrue: field(name: "Warranty true") {
        ...KeyValue
      }
      deviceWarrantyFalse: field(name: "Warranty false") {
        ...KeyValue
      }      
    }
  }
  
  fragment KeyValue on ReferenceField {
    targetItem {
      key: field(name: "Key") {
        value
      }
    }
  }
  `,
  });

  // GQL query to return the labels for the shipping section
  const queryData3 = JSON.stringify({
    query: `{
    labels: item(path: "${path}/Labels", language: "${language}") {
      shippingTitle: field(name: "Shipping title") {
        ...KeyValue
      }
      shippingClinicDescription: field(name: "Clinic description") {
        ...KeyValue
      }
      shippingPatientDescription: field(name: "Patient description") {
        ...KeyValue
      }
    }
  }
  
  fragment KeyValue on ReferenceField {
    targetItem {
      key: field(name: "Key") {
        value
      }
    }
  }
  `,
  });

  // GQL query to return the config and toolbar sections from single view
  const queryData4 = JSON.stringify({
    query: `{
      config: item(path: "${path}/config", language: "${language}") {
        name
        dateFormat: field(name: "date format") {
          value
        }
        addressFormat: field(name: "address format") {
          value
        }
      }
      toolbar: item(path: "${path}/Details toolbar", language: "${language}") {
        name
        children {
          name
          text: field(name: "text") {
            ... on ReferenceField {
              targetItem {
                key: field(name: "Key") {
                  value
                }
              }
            }
          }
          type: field(name: "type") {
            value
          }
          icon: field(name: "icon") {
            value
          }
          iconAlign: field(name: "icon align") {
            value
          }
          buttonAlign: field(name: "button align") {
            value
          }
        }
      }
  }
  `,
  });

  const promise1 = fetchData(gqlUrl, token, queryData1);
  const promise2 = fetchData(gqlUrl, token, queryData2);
  const promise3 = fetchData(gqlUrl, token, queryData3);
  const promise4 = fetchData(gqlUrl, token, queryData4);

  return Promise.all([promise1, promise2, promise3, promise4])
    .then(result => {
      return ['data', result];
    })
    .catch(error => {
      return ['error', error];
    });
};
