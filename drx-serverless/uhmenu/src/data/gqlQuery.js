function getUHmenuQuery() {
  return `
    query getItem($path: String!, $language: String!) {
      item(path: $path, language: $language) {
        id
        name
        path

        #features

        useUniversalHeader: field(name: "useUniversalHeader") {
          ... on CheckboxField {
            value: boolValue
          }
        }

        #devConfig

        #Universal Header

        uhmenuTitle: field(name: "uhmenuTitle") {
          value
        }

        recipientCarerText: field(name: "recipientCarerText") {
          value
        }

        recipientText: field(name: "recipientText") {
          value
        }

        carerText: field(name: "carerText") {
          value
        }

        logoutLabel: field(name: "logoutLabel") {
          value
        }

        dropDownList: field(name: "uhDropDownList") {
          ... on MultilistField {
            links: targetItems {
              name: displayName

              icon: field(name: "icon") {
                value
              }

              link: field(name: "link") {
                ... on LinkField {
                  text
                  url
                  target
                }
              }
            }
          }
        }

        dropDownListForPending: field(name: "uhDropDownListForPending") {
          ... on MultilistField {
            links: targetItems {
              name: displayName

              icon: field(name: "icon") {
                value
              }

              link: field(name: "link") {
                ... on LinkField {
                  text
                  url
                  target
                }
              }
            }
          }
        }

        #whatsNew

        whatsNewToggle: field(name: "toggle") {
          ... on CheckboxField {
            value: boolValue
          }
        }

        whatsNewCloseButton: field(name: "close button") {
          value
        }

        whatsNewPopupClose: field(name: "popup - close") {
          value
        }

        whatsNewPopupLabel: field(name: "popup - label") {
          value
        }

        whatsNewVersion: field(name: "version") {
          value
        }

        whatsNewContent: field(name: "content") {
          ... on MultilistField {
            slides: targetItems {
              url
              name
              buttonAction: field(name: "button action") {
                value
              }
              buttonStyle: field(name: "button style") {
                value
              }
              buttonText: field(name: "button text") {
                value
              }

              text: field(name: "text") {
                value
              }

              title: field(name: "title") {
                value
              }

              jmage: field(name: "image") {
                ... on ImageField {
                  alt
                  src
                  id
                  value
                }
              }
            }
          }
        }

        contentForPending: field(name: "contentForPending") {
          ... on MultilistField {
            slides: targetItems {
              url
              name
              buttonAction: field(name: "button action") {
                value
              }
              buttonStyle: field(name: "button style") {
                value
              }
              buttonText: field(name: "button text") {
                value
              }

              text: field(name: "text") {
                value
              }

              title: field(name: "title") {
                value
              }

              jmage: field(name: "image") {
                ... on ImageField {
                  alt
                  src
                  id
                  value
                }
              }
            }
          }
        } 
      }
    }
  `;
}

module.exports = {getUHmenuQuery};
