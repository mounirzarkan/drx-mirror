export default function (country) {
  return `
    {
      settings: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Adaptive Forms/About Me 2") {   
        regionsAPI: field(name: "regionsAPI") {
          value
        }

        message1: field(name: "message1") {
          ...KeyValue
        }

        message2: field(name: "message2") {
          ...KeyValue
        }

        message3: field(name: "message3") {
          ...KeyValue
        }

        message4: field(name: "message4") {
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
