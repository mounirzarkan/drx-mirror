export default function (country) {
  return `
  
  {
    
    edit: item(path: "/sitecore/content/drx/${country.toUpperCase()}/Content Modules/Address/default/edit") {
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
        type: field(name: "Type") {
          value
        }
        apiField: field(name: "Api field") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
        promptText: field(name: "Prompt text") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
        optionalText: field(name: "Optional text") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
        hint: field(name: "Hint") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }

        validators: children {
          name
          
          type: field(name: "Type") {
            value
          }

          key: field(name: "Key") {
            value
          }
          
          apiField: field(name: "api field") {
            ... on ReferenceField {
              targetItem {
                name
              }
            }
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
          
        }

      }
    }
  }
  
  `;
}
