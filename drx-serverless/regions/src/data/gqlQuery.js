function getFooterQuery() {
  const query = `
      query getItem($path: String!, $language: String!) {
        item(path: $path, language: $language) {
          id
          name
          path
  
          Shared: field(name: "shared footer") {
            ... on ReferenceField {
              data: targetItem {
                copyright: field(name: "copyright") {
                  value
                }
  
                columnOneLinks: field(name: "columnOneLinks") {
                  ... on MultilistField {
                    links: targetItems {
                      name
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
  
                columnTwoLinks: field(name: "columnTwoLinks") {
                  ... on MultilistField {
                    links: targetItems {
                      name
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
  
                columnThreeLinks: field(name: "columnThreeLinks") {
                  ... on MultilistField {
                    links: targetItems {
                      name
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
  
                socials: field(name: "socials") {
                  ... on MultilistField {
                    links: targetItems {
                      name
                      title: field(name: "title") {
                        value
                      }
                      image: field(name: "image") {
                        ... on ImageField {
                          value
                          src
                          alt
                          id
                          width
                        }
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
              }
            }
          }
        }
      }
    `;
  return query;
}

function getHeaderQuery() {
  const query = `
      query getItem($path: String!, $language: String) {
        item(path: $path, language: $language) {
          id
          name
          path
  
          storeLogoutToken: field(name: "storeLogoutToken") {
            value
          }
  
          Shared: field(name: "shared header") {
            ... on ReferenceField {
              data: targetItem {
                #navigatin
  
                topNavList: field(name: "topNavList") {
                  ... on MultilistField {
                    links: targetItems {
                      name
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
  
                homeLink: field(name: "homeLink") {
                  ... on LinkField {
                    url
                    text
                    target
                  }
                }
  
                professionalsLink: field(name: "professionalsLink") {
                  ... on LinkField {
                    text
                    url
                    text
                  }
                }
  
                loginLink: field(name: "loginLink") {
                  ... on LinkField {
                    url
                    text
                    target
                  }
                }
  
                rootItem: field(name: "rootItem") {
                  ... on ReferenceField {
                    target: targetItem {
                      url
                    }
                  }
                }
  
                #mobile Toolbar
  
                contactLink: field(name: "contactLink") {
                  ... on LinkField {
                    url
                    text
                    target
                  }
                }
  
                menuText: field(name: "menu Text") {
                  value
                }
  
                closeText: field(name: "close Text") {
                  value
                }
  
                clinicFinderLink: field(name: "clinicFinderLink") {
                  ... on LinkField {
                    url
                    text
                    target
                  }
                }
  
                additionalList: field(name: "additionalList") {
                  ... on MultilistField {
                    links: targetItems {
                      name
                      link: field(name: "link") {
                        ... on LinkField {
                          url
                          text
                          target
                        }
                      }
                    }
                  }
                }
              }
            }
          }
  
          #country and language
  
          languageCode: field(name: "languageCode") {
            value
          }
  
          #features
  
          useUniversalHeader: field(name: "useUniversalHeader") {
            ... on CheckboxField {
              value: boolValue
            }
          }
  
          #devConfig
  
          COCHLEAR_COOKIE_DOMAIN: field(name: "COCHLEAR_COOKIE_DOMAIN") {
            value
          }
  
          AUTH_UH_DROPDOWN_MENU: field(name: "AUTH_UH_DROPDOWN_MENU") {
            value
          }
  
          AUTH_REVOKE: field(name: "AUTH_REVOKE") {
            value
          }
  
          AUTH_AUTHORIZE: field(name: "AUTH_AUTHORIZE") {
            value
          }
  
          AUTH_CIM_RECIPIENT_LOGOUT: field(name: "AUTH_CIM_RECIPIENT_LOGOUT") {
            value
          }
  
          COCHLEAR_DRX_MAIN: field(name: "COCHLEAR_DRX_MAIN") {
            value
          }
  
          STORE_LOGOUT: field(name: "STORE_LOGOUT") {
            value
          }
  
          COCHLEAR_MCR: field(name: "COCHLEAR_MCR") {
            value
          }
  
          ASSETS_ENDPOINT: field(name: "ASSETS_ENDPOINT") {
            value
          }
  
          AUTHORIZE_USER_APP: field(name: "AUTHORIZE_USER_APP") {
            value
          }
  
          AUTHORIZE_USER_APP_AUTHORIZE_PATH: field(
            name: "AUTHORIZE_USER_APP_AUTHORIZE_PATH"
          ) {
            value
          }
  
          #Universal Header
  
          uhmenuTitle: field(name: "uhmenuTitle") {
            value
          }
  
          logoutLabel: field(name: "logoutLabel") {
            value
          }
  
          dropDownList: field(name: "dropDownList") {
            value
          }
  
          #whatsNew
  
          popupClose: field(name: "popup - Close") {
            value
          }
  
          popupLabel: field(name: "popup - label") {
            value
          }
  
          version: field(name: "version") {
            value
          }
  
          content: field(name: "content") {
            ... on MultilistField {
              slides: targetItems {
                url
                name
                action: field(name: "action") {
                  value
                }
                style: field(name: "style") {
                  value
                }
                jmage: field(name: "image") {
                  value
                }
                title: field(name: "title") {
                  value
                }
                field(name: "text") {
                  value
                }
              }
            }
          }
        }
      }
    `;
  return query;
}

function getRegionsQuery(countryCode) {
  const query = `
  query {
    item(
        path: "/sitecore/content/CDS/regions/${countryCode}", 
        language: "en") {
            children {
                displayName,
                    
                name : field(name:"name"){
                    value
                },
    
                code : field(name:"code"){
                    value
                }
    
            }
        }
    }
  `;
  return query;
}

module.exports = {getFooterQuery, getHeaderQuery, getRegionsQuery};
