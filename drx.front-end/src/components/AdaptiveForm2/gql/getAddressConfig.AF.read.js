export default function (country) {
  return `
  
  {
    
    read: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Address/default 2/read") {
      clkErrorLabel: field(name: "clk error Label") {
        ... on ReferenceField {
          targetItem {
            field(name: "Key") {
              value
            }
          }
        }
      }
      errorLabel: field(name: "error Label") {
        ... on ReferenceField {
          targetItem {
            field(name: "Key") {
              value
            }
          }
        }
      }
      children {
        name
        label: field(name: "Label") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
        value: field(name: "Value") {
          value
        }

        validators: children {
          name

          type: field(name: "Type") {
            value
          }

          key: field(name: "Key") {
            value
          }

          message: field(name: "Message") {
            ... on ReferenceField {
              targetItem {
                field(name: "Key") {
                  value
                }
              }
            }
          }

          apiField: field(name: "api field") {
            ... on ReferenceField {
              targetItem {
                name
              }
            }
          }

          
        }
      }
    }
  }
   

  `;
}
