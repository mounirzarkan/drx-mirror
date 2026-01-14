export default function (country) {
  return `
  {
    
    settings: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Address/default") {
      
      prompt: field(name: "prompt") {
        ...KeyValue
      }

      promptMobile: field(name: "prompt mobile") {
        ...KeyValue
      }

      hint: field(name: "hint") {
        ...KeyValue
      }

      label: field(name: "label") {
          ...KeyValue
      }
        
      loading: field(name: "loading") {
        ...KeyValue
      }
 
      lookupErrorLabel: field(name: "lookup error label") {
        ...KeyValue
      }

      addressNotFoundText: field(name: "address not found - text") {
        ...KeyValue
      }

      addressNotFoundButton: field(name: "address not found - button") {
        ...KeyValue
      }

      cityState: field(name: "CityState display format") {
        value
      }

      geoNamesId: field(name: "Geonames id") {
        value
      }
      
      searchCharLength: field(name: "Search char length") {
        value
      }

      swapEditDisplayOrder: field(name: "Swap edit display order") {
        ... on CheckboxField {
          boolValue
        }
      }

    }
  }
  fragment KeyValue on ReferenceField {
    ... on ReferenceField {
      targetItem {
        field(name: "Key") {
          value
        }
      }
    }
  }
  `;
}

// label: field(name: "label") {
//   ...KeyValue
// }

// optional: field(name: "optional") {
//   ...KeyValue
// }
