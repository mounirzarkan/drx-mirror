export default function (country) {
  return `
    {
      
      modal: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Address/default 2") {

        modalTitle: field(name: "modalTitle") {
          ...KeyValue
        }

        modalBody: field(name: "modalBody") {
          ...KeyValue
        }

        modalCancel: field(name: "modalCancel") {
          ...KeyValue
        }

        modalDelete: field(name: "modalDelete") {
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
