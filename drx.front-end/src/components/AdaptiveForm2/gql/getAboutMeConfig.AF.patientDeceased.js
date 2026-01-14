export default function (country) {
  return `
    {
      patientDeceased: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Adaptive Forms/About Me 2") {   
        patientDeceasedTitle: field(name: "patientDeceasedTitle") {
          ...KeyValue
        }

        patientDeceasedBody: field(name: "patientDeceasedBody") {
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
