export default function (country) {
  return `
    {
      
      list: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Address/default 2") {
        
        add: field(name: "add") {
          ...KeyValue
        }
  
        address: field(name: "address") {
          ...KeyValue
        }
  
        addressList: field(name: "addressList") {
          ...KeyValue
        }
        
        billing: field(name: "billing") {
          ...KeyValue
        }
        
        mailing: field(name: "mailing") {
          ...KeyValue
        }
        
        shipping: field(name: "shipping") {
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
    `;
}
