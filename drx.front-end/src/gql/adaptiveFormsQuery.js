export function adaptiveFormsQuery(country, language) {
  return `

    {
      item(path: "/sitecore/content/drx/US/Content Modules/Adaptive Forms/About Me") {
        
        dateMask: field(name: "Date mask") {
          value
        }
        minimumAge: field(name: "Minimum age") {
          ... on NumberField {
            numberValue
          }
        }
        saveButton: field(name: "Save button") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        saving: field(name: "saving") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        saved: field(name: "saved") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        cancelButton: field(name: "Cancel button") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        editLink: field(name: "Edit link") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        cancelLink: field(name: "Cancel link") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        promptText: field(name: "Prompt text") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        promptTextAbbrv: field(name: "Prompt text abbrv") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
        recipientTab: field(name: "Recipient tab") {
          ... on ReferenceField {
            targetItem {
              value: field(name: "Key") {
                value
              }
            }
          }
        }
      }
    }
    
      
    `;
}
