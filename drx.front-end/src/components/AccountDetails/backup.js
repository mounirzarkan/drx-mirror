// import React from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode';

// import {
//   authenticationService,
//   environment,
// } from '../../../utils/_services';
// import config from '../../../config';
// import getMinutes from '../../../utils/getMinutes';

// import AddressDetails from '../_reorganize/forms/AddressDetails/AddressDetails';
// import ContactDetails from '../_reorganize/forms/ContactDetails/ContactDetails';
// import PersonalDetails from '../_reorganize/forms/PersonalDetails/PersonalDetails';
// import CarerDetails from '../_reorganize/forms/CarerDetails/CarerDetails';
// import ErrorMessage from '../Shared/ErrorMessage/ErrorMessage';

// const { country, lang } = config;
// const domainValue = config.cookieDomain[environment];
// const getApi = config.authenticate[environment];
// const CochlearHomePage = config.CochlearDotCom[environment];

// const errorMessageLabelsOffline = {
//   lblTitle: 'That’s strange, it seems something went wrong.',
//   lblReadText:
//     'We’re working to fix the problem and we’ll be up and running soon.',
//   lblWriteText: 'We had a problem updating your ',
//   lblHelpText:
//     'If you need immediate help or this problem persists, contact our <a class="error-message__link" href="https://www.cochlear.com/us/en/connect/contact-us/contact-us-recipient" target="_blank" rel="noopener noreferrer">customer support</a> team.',
//   lblCode: 'Error code',
//   lblCochlearHome: 'Cochlear home',
// };

// class AccountDetails extends React.Component {
//   mounted = false;

//   constructor(props) {
//     // fires before component is mounted
//     super(props); // makes this refer to this component
//     this.state = {
//       numberOfServices: 3,
//       isLoading: [],
//       userType: null,
//       userDetails: {},
//       userAddress: {},
//       personalLabels: {},
//       addressLabels: {},
//       contactLabels: {},
//       carerLabels: {},
//       buttonLabels: {},
//       errorMessageLabels: {},
//       carerPopupLabels: {},
//       formLabelsError: null,
//       formDataError: null,
//       formAddressDataError: null,
//       activeForm: null,
//       countryCode: null,
//       carersRecipients: {},
//       thisCarerDetails: {},
//       activeTab: 0,
//       activeListItem: 0,
//       activeId: null,
//       mounted: false,
//     };

//     this.callbackPersonalDetails = this.callbackPersonalDetails.bind(
//       this,
//     );
//     this.callbackContactDetails = this.callbackContactDetails.bind(
//       this,
//     );
//     this.callbackAddressDetails = this.callbackAddressDetails.bind(
//       this,
//     );
//     this.callbackActiveForm = this.callbackActiveForm.bind(this);
//     this.handleClickActiveTab = this.handleClickActiveTab.bind(this);
//   }

//   componentDidMount() {
//     // fires immediately after the initial render
//     this.setState({ mounted: true });
//     this.mounted = true;

//     // Identify if we are a recipient or a carer and render form components.
//     const { currentUser } = this.props;
//     console.log(this.props);
//     const decoded = currentUser && jwtDecode(currentUser);
//     const id = decoded && decoded.sub;

//     // userType will be 'Carer' or 'Recipient'
//     const userType =
//       decoded && decoded['https://www.cochlear.com/user_type'];
//     const countryCode =
//       decoded && decoded['https://www.cochlear.com/country_code'];
//     this.setUser(userType, countryCode);

//     if (userType === 'Recipient') {
//       // Make a call to Sitecore and return the item layout service. Update state.
//       this.getRecipientForm();

//       // Make a call to Lambda and return the user data. Update state.
//       this.getUserData('account', getApi.account, id);
//       this.getUserData('address', getApi.address, id);
//     }

//     if (userType === 'Carer') {
//       const carersRecipients =
//         decoded && decoded['https://www.cochlear.com/recipient'];

//       this.setCarerDetails(
//         decoded.given_name,
//         decoded.family_name,
//         id,
//       );
//       this.setRecipients(JSON.parse(carersRecipients));

//       // Make a call to Sitecore and return the item layout service. Update state.
//       this.getRecipientForm();

//       // Make a call to Lambda and return the user data. Update state.
//       this.getUserData('account', getApi.account, id);
//       this.getUserData('address', getApi.address, id);
//     }
//   }

//   componentWillUnmount() {
//     // fires immediately before component is unmounted
//     // from DOM (removed)
//     this.mounted = false;
//   }

//   setCarerDetails(firstName, lastName, id) {
//     this.setState({
//       thisCarerDetails: {
//         firstName,
//         lastName,
//         id,
//       },
//     });
//   }

//   setRecipients(recipients) {
//     this.setState({
//       carersRecipients: recipients,
//     });
//   }

//   setUser(userType, countryCode) {
//     this.setState({
//       userType,
//       countryCode,
//     });
//   }

//   setFormLabels(data) {
//     // get all personal details form label data

//     const {
//       personalLabels,
//       addressLabels,
//       contactLabels,
//       carerLabels,
//       carerPopupLabels,
//       buttonLabels,
//       errorMessageLabels,
//     } = this.state;

//     if (data) {
//       data.map(item => {
//         /* Personal Details Labels */
//         if (item.name === 'PersonalDetailsLabel') {
//           personalLabels.title = item;
//         }

//         if (item.name === 'CarerFirstNameTitleLabel') {
//           personalLabels.carerTitle = item;
//         }

//         if (item.name === 'Name') {
//           personalLabels.name = item;
//         }

//         if (item.name === 'FirstName') {
//           personalLabels.firstName = item;
//         }

//         if (item.name === 'LastName') {
//           personalLabels.lastName = item;
//         }

//         if (item.name === 'DoB') {
//           personalLabels.dateOfBirth = item;
//         }

//         if (item.name === 'Day') {
//           personalLabels.day = item;
//         }

//         if (item.name === 'Month') {
//           personalLabels.month = item;
//         }

//         if (item.name === 'Year') {
//           personalLabels.year = item;
//         }

//         /* Address Labels */
//         if (item.name === 'AddressDetailsLabel') {
//           addressLabels.title = item;
//         }

//         if (item.name === 'AddressAndContactDetailsLabel') {
//           addressLabels.titleCombined = item;
//         }

//         if (item.name === 'RecipientPrivacyLabel') {
//           addressLabels.recipientPrivacy = item;
//         }

//         if (item.name === 'Address') {
//           addressLabels.address = item;
//         }

//         if (item.name === 'Address1') {
//           addressLabels.address1 = item;
//         }

//         if (item.name === 'Address2') {
//           addressLabels.address2 = item;
//         }

//         if (item.name === 'Address3') {
//           addressLabels.address3 = item;
//         }

//         if (item.name === 'City') {
//           addressLabels.city = item;
//         }

//         if (item.name === 'CountryOfResidence') {
//           addressLabels.countryOfResidence = item;
//         }

//         if (item.name === 'Postcode') {
//           addressLabels.postcode = item;
//         }

//         if (item.name === 'State') {
//           addressLabels.state = item;
//         }

//         /* Contact Labels */
//         if (item.name === 'ContactDetailsLabel') {
//           contactLabels.title = item;
//         }

//         if (item.name === 'Mobile') {
//           contactLabels.mobile = item;
//         }

//         if (item.name === 'Home') {
//           contactLabels.home = item;
//         }

//         if (item.name === 'Work') {
//           contactLabels.work = item;
//         }

//         if (item.name === 'Fax') {
//           contactLabels.fax = item;
//         }

//         if (item.name === 'NumberType') {
//           contactLabels.numberType = item;
//         }

//         if (item.name === 'CountryCode') {
//           contactLabels.countryCode = item;
//         }

//         if (item.name === 'PhoneNumber') {
//           contactLabels.phoneNumber = item;
//         }

//         if (item.name === 'PreferredContact') {
//           contactLabels.preferredContact = item;
//         }

//         if (item.name === 'SMS') {
//           contactLabels.sms = item;
//         }

//         if (item.name === 'LabelPreferredNumber') {
//           contactLabels.lblPreferredContact = item;
//         }

//         if (item.name === 'LabelSMSAlertsEnabled') {
//           contactLabels.lblSms = item;
//         }

//         /* Carer Labels */
//         if (item.name === 'CarerDetailsLabel') {
//           carerLabels.title = item;
//         }

//         /* Buttons and Labels */
//         if (item.name === 'BtnCancelLabel') {
//           buttonLabels.btnCancelLabel = item.label.value;
//         }

//         if (item.name === 'BtnEditLabel') {
//           buttonLabels.btnEditLabel = item.label.value;
//         }

//         if (item.name === 'BtnSavedLabel') {
//           buttonLabels.btnSavedLabel = item.label.value;
//         }

//         if (item.name === 'BtnSaveLabel') {
//           buttonLabels.btnSaveLabel = item.label.value;
//         }

//         if (item.name === 'BtnSavingLabel') {
//           buttonLabels.btnSavingLabel = item.label.value;
//         }

//         if (item.name === 'BtnAddNumberLabel') {
//           buttonLabels.btnAddNumberLabel = item.label.value;
//         }

//         if (item.name === 'BtnDeleteNumberLabel') {
//           buttonLabels.btnDeleteNumberLabel = item.label.value;
//         }

//         if (item.name === 'MissingInformationLabel') {
//           buttonLabels.btnMissingInformationLabel = item.label.value;
//         }

//         if (item.name === 'MissingContactNumberLabel') {
//           buttonLabels.btnMissingContactNumberLabel =
//             item.label.value;
//         }

//         if (item.name === 'MissingPhoneLabel') {
//           buttonLabels.btnMissingPhoneLabel = item.label.value;
//         }

//         if (item.name === 'LabelCarer') {
//           buttonLabels.lblCarer = item.label.value;
//         }

//         if (item.name === 'LabelRecipient') {
//           buttonLabels.lblRecipient = item.label.value;
//         }

//         if (item.name === 'LabelMore') {
//           buttonLabels.lblMore = item.label.value;
//         }

//         if (item.name === 'LabelCochlearHome') {
//           buttonLabels.lblCochlearHome = item.label.value;
//         }
//         if (item.name === 'LabelTryAgain') {
//           buttonLabels.lblTryAgain = item.label.value;
//         }

//         /* Error Message Labels */
//         if (item.name === 'ErrorMessageTitle') {
//           errorMessageLabels.lblTitle = item.label.value;
//         }
//         if (item.name === 'ErrorMessageReadText') {
//           errorMessageLabels.lblReadText = item.label.value;
//         }
//         if (item.name === 'ErrorMessageWriteText') {
//           errorMessageLabels.lblWriteText = item.label.value;
//         }
//         if (item.name === 'ErrorMessageHelpText') {
//           errorMessageLabels.lblHelpText = item.label.value;
//         }
//         if (item.name === 'ErrorMessageCode') {
//           errorMessageLabels.lblCode = item.label.value;
//         }

//         /* Carer Popup Labels */
//         if (item.name === 'LabelCarerPopupUpdateCarerA') {
//           carerPopupLabels.lblCarerA = item.label.value;
//         }
//         if (item.name === 'LabelCarerPopupUpdateCarerB') {
//           carerPopupLabels.lblCarerB = item.label.value;
//         }
//         if (item.name === 'LabelCarerPopupUpdateRecipientA') {
//           carerPopupLabels.lblRecipientA = item.label.value;
//         }
//         if (item.name === 'LabelCarerPopupUpdateRecipientB') {
//           carerPopupLabels.lblRecipientB = item.label.value;
//         }
//         if (item.name === 'LabelCarerPopupMessageA') {
//           carerPopupLabels.lblMessageA = item.label.value;
//         }
//         if (item.name === 'LabelCarerPopupMessageB') {
//           carerPopupLabels.lblMessageB = item.label.value;
//         }

//         return true;
//       });
//     }

//     this.setState(prevState => ({
//       personalLabels,
//       addressLabels,
//       contactLabels,
//       carerLabels,
//       buttonLabels,
//       isLoading: [...prevState.isLoading, 'FormLabels'],
//     }));
//   }

//   setCarerRecipientNames(data, userId) {
//     // after changing name inside the personal details form
//     const {
//       userType,
//       thisCarerDetails,
//       carersRecipients,
//     } = this.state;

//     // first and last name initially set by token values
//     // but here we update after a saved change
//     // now we can update based on the account api in case changes have been made
//     if (userType === 'Carer') {
//       // update the carer details that were initially taken from the token
//       if (thisCarerDetails.id === userId) {
//         return this.setCarerDetails(
//           data.firstName.value || data.firstName,
//           data.lastName.value || data.lastName,
//           thisCarerDetails.id,
//         );
//       }

//       // update the carer recipients details that were initially taken from the token
//       const recipients = [...carersRecipients];
//       recipients.map(recipient => {
//         if (recipient.CochlearId === userId) {
//           recipient.firstName =
//             data.firstName.value || data.firstName;
//           recipient.lastName = data.lastName.value || data.lastName;
//           return this.setRecipients(recipients);
//         }
//         return null;
//       });
//     }
//     return null;
//   }

//   setFormData(data, id) {
//     this.setCarerRecipientNames(data, id);
//     this.setState(prevState => ({
//       userDetails: data,
//       isLoading: [...prevState.isLoading, 'UserData'],
//     }));
//   }

//   setAddressData(data) {
//     this.setState(prevState => ({
//       userAddress: data,
//       isLoading: [...prevState.isLoading, 'AddressData'],
//     }));
//   }

//   setFormLabelsError(error) {
//     this.setState(prevState => ({
//       formLabelsError: error,
//       isLoading: [...prevState.isLoading, 'FormLabelsError'],
//     }));
//   }

//   setFormDataError(error) {
//     this.setState(prevState => ({
//       formDataError: error,
//       isLoading: [...prevState.isLoading, 'FormDataError'],
//     }));
//   }

//   setFormAddressDataError(error) {
//     this.setState(prevState => ({
//       formAddressDataError: error,
//       isLoading: [...prevState.isLoading, 'FormAddressDataError'],
//     }));
//   }

//   getRecipientForm() {
//     axios
//       .get(getApi.layout)
//       .then(result => {
//         if (this.mounted) {
//           const formsData =
//             result.data.sitecore.route.placeholders['drx-main'][0]
//               .fields.data.item.children;
//           this.setFormLabels(formsData);
//         }
//       })
//       .catch(error => {
//         console.log(
//           'AccountDetails -> getRecipientForm -> error',
//           error,
//         );
//         if (this.mounted) {
//           const { response } = error;
//           const err = response ? response.status : 'Network error';
//           this.setFormLabelsError(err);
//         }
//       });
//   }

//   getUserData(type, endpoint, id) {
//     const { currentUser: token } = this.props;
//     axios
//       .get(`${endpoint}?id=${id}`, {
//         params: {},
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(result => {
//         if (this.mounted) {
//           const newToken =
//             result.headers['x-amzn-remapped-authorization'];
//           if (newToken) {
//             this.updateUserToken(newToken);
//           }
//           if (type === 'address') {
//             const addressDetails = result.data.data.address;
//             this.setAddressData(addressDetails);
//           }
//           if (type === 'account') {
//             const userDetails = result.data.data.account;
//             this.setFormData(userDetails, id);
//           }
//         }
//       })
//       .catch(error => {
//         if (this.mounted) {
//           const { response } = error;
//           console.log('AccountDetails -> response', response);

//           if (
//             response &&
//             [401, 403].indexOf(response.status) !== -1
//           ) {
//             // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//             authenticationService.renew();
//             return false;
//           }

//           // multi carers scenario, lambda not supposed to expose contact for legal reasons.
//           // Recipient address not allowed to be viewed by carer, if this recipient has multi carers.
//           if (
//             response &&
//             response.status === 451 &&
//             type === 'address'
//           ) {
//             return this.setAddressData('');
//           }

//           const err = response ? response.status : 'Network error';
//           if (type === 'account') {
//             this.setFormDataError(err);
//           }
//           if (type === 'address') {
//             this.setFormAddressDataError(err);
//           }
//         }
//       });
//     // }
//   }

//   handleClickActiveTab(e) {
//     const { tab, id, listitem } = e.currentTarget.dataset;
//     // listitem and id only dont get passed when clicking on the "more" tab

//     this.setState(prevState => {
//       const { activeListItem } = this.state;

//       // only update if tab is different and not the 'more' tab
//       if (prevState.activeTab !== Number(tab) && Number(tab) !== 99) {
//         this.getUserData('account', getApi.account, id);
//         this.getUserData('address', getApi.address, id);
//         return {
//           activeTab: Number(tab),
//           activeListItem: Number(listitem),
//           isLoading: ['FormLabels'], // labels already loaded
//           formDataError: null,
//           formAddressDataError: null,
//           activeForm: null,
//           activeId: id,
//         };
//       }

//       // if 'more' tab is clicked and previous clicked was 'more' tab,
//       // set it to list item so that it behaves more like a active/inactive toggle
//       if (prevState.activeTab === 99 && Number(tab) === 99) {
//         // set active to the same number as the active list item, that way none of the visible tabs will be selected
//         return {
//           activeTab: activeListItem,
//         };
//       }

//       // 'more' tab clicked
//       if (prevState.activeTab !== Number(tab) && Number(tab) === 99) {
//         return {
//           activeTab: Number(tab),
//           activeForm: null,
//         };
//       }

//       return null;
//     });
//   }

//   callbackActiveForm(formName, isActive) {
//     this.setState({
//       activeForm: isActive ? formName : null,
//     });
//   }

//   callbackPersonalDetails(formData, userId) {
//     this.setCarerRecipientNames(formData, userId);

//     this.setState(prevState => ({
//       userDetails: {
//         ...prevState.userDetails,
//         firstName: {
//           value: formData.firstName,
//         },
//         lastName: {
//           value: formData.lastName,
//         },
//         dateOfBirth: {
//           value: formData.dateOfBirth,
//         },
//       },
//       activeForm: null,
//     }));
//   }

//   callbackAddressDetails(formData) {
//     this.setState(prevState => ({
//       userAddress: {
//         ...prevState.userAddress,
//         street1: {
//           value: formData.street1,
//         },
//         street2: {
//           value: formData.street2,
//         },
//         street3: {
//           value: formData.street3,
//         },
//         city: {
//           value: formData.city,
//         },
//         state: {
//           value: formData.state,
//         },
//         postalCode: {
//           value: formData.postalCode,
//         },
//       },
//       activeForm: null,
//     }));
//   }

//   callbackContactDetails(formData) {
//     this.setState(prevState => ({
//       userDetails: {
//         ...prevState.userDetails,
//         phones: {
//           value: formData.phones,
//         },
//       },
//       activeForm: null,
//     }));
//   }

//   updateUserToken(token) {
//     // update service
//     authenticationService.updateCurrentUser(token);

//     // update cookie
//     Cookies.set('currentUser', token, {
//       domain: domainValue,
//       secure: true,
//       expires: getMinutes(120),
//     });
//   }

//   render() {
//     const { currentUser, userId } = this.props;

//     const {
//       isLoading,
//       numberOfServices,
//       countryCode,
//       userDetails,
//       userAddress,
//       buttonLabels,
//       personalLabels,
//       addressLabels,
//       contactLabels,
//       carerLabels,
//       carerPopupLabels,
//       errorMessageLabels,
//       formLabelsError,
//       formDataError,
//       formAddressDataError,
//       activeForm,
//       carersRecipients,
//       thisCarerDetails,
//       activeTab,
//       activeListItem,
//       activeId,
//     } = this.state;

//     // Carer tabs
//     const recipients = carersRecipients.length && carersRecipients;

//     return (
//       <div
//         className={`content__box ${recipients ? 'content__box--tabs' : ''
//           }`}
//       >
//         {recipients && (
//           <div className="tabs is-fullwidth">
//             <ul>
//               {/* The Carers tab */}
//               <li className={activeTab === 0 ? 'is-active' : ''}>
//                 <button
//                   type="button"
//                   data-tab="0"
//                   data-listitem="0"
//                   data-id={thisCarerDetails.id}
//                   onClick={this.handleClickActiveTab}
//                   disabled={isLoading.length < numberOfServices}
//                 >
//                   <p>
//                     {thisCarerDetails.firstName}{' '}
//                     {thisCarerDetails.lastName}
//                   </p>
//                   <span>{buttonLabels.lblCarer}</span>
//                 </button>
//               </li>
//               {/* The first recipient. Hidden on mobile if there is more than one recipient */}
//               {/* They will be added to the recipient list in the 'more' tab */}
//               <li
//                 className={`${recipients.length > 1 ? 'is-hidden-mobile' : ''
//                   } ${activeTab === 1 ? 'is-active' : ''}`}
//               >
//                 <button
//                   type="button"
//                   data-tab="1"
//                   data-listitem="1" // this matches their position in the list as well
//                   data-id={recipients[0].CochlearId}
//                   onClick={this.handleClickActiveTab}
//                   disabled={isLoading.length < numberOfServices}
//                 >
//                   <p>
//                     {recipients[0].firstName} {recipients[0].lastName}
//                   </p>
//                   <span>{buttonLabels.lblRecipient}</span>
//                 </button>
//               </li>
//               {/* Only visible in desktop view if there are exactly 2 recipients */}
//               {recipients.length > 1 &&
//                 (recipients.length === 2 ? (
//                   <>
//                     <li
//                       className={`is-hidden-mobile ${activeTab === 2 ? 'is-active' : ''
//                         }`}
//                     >
//                       <button
//                         type="button"
//                         data-tab="2"
//                         data-listitem="2" // this matches their position in the list as well
//                         data-id={recipients[1].CochlearId}
//                         onClick={this.handleClickActiveTab}
//                         disabled={isLoading.length < numberOfServices}
//                       >
//                         <p>
//                           {recipients[1].firstName}{' '}
//                           {recipients[1].lastName}{' '}
//                         </p>
//                         <span>{buttonLabels.lblRecipient}</span>
//                       </button>
//                     </li>

//                     {/* mobile view  when there is 2 recipients */}
//                     <li
//                       className={`${activeTab === 99 ? 'is-active' : ''
//                         } ${recipients.length > 1
//                           ? 'is-hidden-tablet'
//                           : ''
//                         }`}
//                     >
//                       <button
//                         type="button"
//                         data-tab="99"
//                         onClick={this.handleClickActiveTab}
//                         disabled={isLoading.length < numberOfServices}
//                       >
//                         <p>
//                           + {recipients.length} {buttonLabels.lblMore}{' '}
//                           <i className="drxi drxi--chevron drxi--lg" />
//                         </p>
//                       </button>
//                     </li>
//                   </>
//                 ) : (
//                   //  When there is more than 2 recipients
//                   <li
//                     className={`${activeTab === 99 ? 'is-active' : ''
//                       }`}
//                   >
//                     <button
//                       type="button"
//                       data-tab="99"
//                       onClick={this.handleClickActiveTab}
//                       disabled={isLoading.length < numberOfServices}
//                     >
//                       <p className="is-hidden-tablet">
//                         + {recipients.length} {buttonLabels.lblMore}{' '}
//                         <i className="drxi drxi--chevron drxi--lg" />
//                       </p>
//                       <p className="is-hidden-mobile">
//                         + {recipients.length - 1}{' '}
//                         {buttonLabels.lblMore}{' '}
//                         <i className="drxi drxi--chevron drxi--lg" />
//                       </p>
//                     </button>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         )}
//         {/* List of all the other recipients a carer may have */}
//         {activeTab === 99 && (
//           // If it is equal to 2 dont show it at all for tablet
//           <section
//             className={`recipients__list
//                   ${recipients.length === 2
//                 ? 'has-2-recipients is-hidden-tablet'
//                 : ''
//               }
//                 `}
//           >
//             <ul>
//               {recipients.map((recipient, index) => {
//                 const { firstName, lastName } = recipient;
//                 return (
//                   // Hide the first one if not on mobile because it will be visible in the tab

//                   <li
//                     key={recipient.CochlearId}
//                     className={`${index === 0 ? 'is-hidden-tablet' : ''
//                       }
//                     ${activeListItem === index + 1 ? 'is-active' : ''}
//                     `}
//                   >
//                     <button
//                       type="button"
//                       data-tab={index + 1}
//                       data-listitem={index + 1}
//                       data-id={recipient.CochlearId}
//                       onClick={this.handleClickActiveTab}
//                       disabled={isLoading.length < numberOfServices}
//                     >
//                       <p>
//                         {firstName} {lastName}
//                       </p>
//                       <span>
//                         {buttonLabels.lblRecipient}{' '}
//                         <i className="drxi drxi--chevron drxi--lg" />
//                       </span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </section>
//         )}
//         {/* if the api calls return an error or errors show the error
//         message */}
//         {formLabelsError || formDataError || formAddressDataError ? (
//           <div className="error-message--container">
//             <ErrorMessage
//               labelData={errorMessageLabelsOffline}
//               errorType="read"
//               errorResponse={
//                 formLabelsError ||
//                 formDataError ||
//                 formAddressDataError
//               }
//             />
//             <a
//               href={`${CochlearHomePage}${country}/${lang}/home`}
//               className="button button--primary button--primary--yellow has-shift-transition has-icon-left"
//             >
//               <i className="drxi drxi--chevron--left" />
//               {errorMessageLabelsOffline.lblCochlearHome}
//             </a>
//           </div>
//         ) : (
//           <>
//             <PersonalDetails
//               isLoading={isLoading}
//               numberOfServices={numberOfServices}
//               labelData={personalLabels}
//               errorMessageLabels={errorMessageLabels}
//               buttonLabels={buttonLabels}
//               carerPopupLabels={carerPopupLabels}
//               userData={userDetails}
//               currentUser={currentUser}
//               userId={activeId || userId}
//               callbackPersonalDetails={this.callbackPersonalDetails}
//               callbackActiveForm={this.callbackActiveForm}
//               activeForm={activeForm}
//               recipients={recipients}
//               activeTab={activeTab}
//             />

//             <AddressDetails
//               isLoading={isLoading}
//               numberOfServices={numberOfServices}
//               labelData={addressLabels}
//               errorMessageLabels={errorMessageLabels}
//               buttonLabels={buttonLabels}
//               carerPopupLabels={carerPopupLabels}
//               userData={userAddress}
//               currentUser={currentUser}
//               userId={activeId || userId}
//               callbackAddressDetails={this.callbackAddressDetails}
//               callbackActiveForm={this.callbackActiveForm}
//               activeForm={activeForm}
//               countryCode={countryCode}
//               recipients={recipients}
//               activeTab={activeTab}
//             />

//             <ContactDetails
//               isLoading={isLoading}
//               numberOfServices={numberOfServices}
//               labelData={contactLabels}
//               errorMessageLabels={errorMessageLabels}
//               buttonLabels={buttonLabels}
//               carerPopupLabels={carerPopupLabels}
//               userData={userDetails}
//               currentUser={currentUser}
//               userId={activeId || userId}
//               callbackContactDetails={this.callbackContactDetails}
//               callbackActiveForm={this.callbackActiveForm}
//               activeForm={activeForm}
//               countryCode={countryCode}
//               recipients={recipients}
//               activeTab={activeTab}
//             />

//             {userDetails.relatedCarers &&
//               userDetails.relatedCarers.value && (
//                 <CarerDetails
//                   isLoading={isLoading}
//                   numberOfServices={numberOfServices}
//                   carerData={userDetails.relatedCarers.value}
//                   labelData={carerLabels}
//                 />
//               )}
//           </>
//         )}
//       </div>
//     );
//   }
// }

// export default AccountDetails;
