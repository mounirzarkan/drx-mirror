// eslint-disable-next-line no-unused-vars
function getAddressConfigQuery_settings(country, language) {
    return `
    
    query getItem($path: String!, $language: String!) {
    
      settings: item(path: $path, language: $language) {
        
        prompt: field(name: "prompt") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
      
        promptMobile: field(name: "prompt mobile") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
      
        loading: field(name: "loading") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
      
        lookupErrorLabel: field(name: "lookup error label") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
      
        addressNotFoundText: field(name: "address not found - text") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
      
        addressNotFoundButton: field(name: "address not found - button") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
        saveLabel: field(name: "save") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
        cancelLabel: field(name: "cancel") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
          savingLabel: field(name: "saving") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
         savedLabel: field(name: "saved") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
        hintLabel: field(name: "hint") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
        optionalLabel: field(name: "optional") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
      addressLabel: field(name: "address") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
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
  
        googleMapsApiKey: field(name: "googleMapsApiKey") {
          value
        }
  
        addressAPIStateTypeId: field(name: "Type id") {
          value
        }
  
        addressAPIStateName: field(name: "name") {
          value
        }
  
      }
  
  }
    `;
  }
  
  function getAddressConfigQuery_read(country, language) {
    return `
    
    query getItem($path: String!, $language: String!) {
  
      read: item(path: $path, language: $language) {
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
  
  function getAddressConfigQuery_edit(country, language) {
    return `
    
    query getItem($path: String!, $language: String!) {
    
      edit: item(path: $path, language: $language) {
        
        isPO: field(name: "isPO") {
          ... on ReferenceField {
            targetItem {
              field(name: "Key") {
                value
              }
            }
          }
        }
  
        useLiveValidation: field(name: "useLiveValidation") {
          value
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
  
  module.exports = {
    getAddressConfigQuery_settings,
    getAddressConfigQuery_edit,
    getAddressConfigQuery_read
  };
  