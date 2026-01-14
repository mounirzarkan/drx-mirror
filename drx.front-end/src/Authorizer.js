// import React from 'react';
// import { Redirect } from 'react-router-dom';
// import queryString from 'query-string';
// import Cookies from 'js-cookie';
// import jwtDecode from 'jwt-decode';
// import NavbarBasic from './components/global/header/NavbarBasic/NavbarBasic';
// import Footer from './components/global/Footer/Footer';
// import AuthorizationError from './components/AuthorizationError/AuthorizationError';
// import config from './config';
// import {
//   authenticationService,
//   environment,
// } from './utils/_services';

// const { country, lang, CochlearDotCom, endpoints } = config;
// const { CIM_RecipientLogout } = endpoints[environment];
// const CochlearHomePage = CochlearDotCom[environment];

// function addhttp(url) {
//   if (!/^(?:f|ht)tps?:\/\//.test(url)) {
//     // eslint-disable-next-line no-param-reassign
//     url = `https://${url}`;
//   }
//   return url;
// }

// class Authorizer extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       error: false, // whether or not to show an error message
//       errorType: '', // type of error screen : Provisional or Generic or Network error
//       errorStatus: null, // server error returned from login call
//     };
//     if (authenticationService.currentUserValue) {
//       console.log(
//         'Authorizer -> constructor -> authenticationService.currentUserValue',
//         authenticationService.currentUserValue,
//       );
//     }
//   }

//   componentDidMount() {
//     const { location } = this.props;
//     const { search } = location;
//     const parsed = queryString.parse(search);
//     const {
//       code,
//       error: callbackError,
//       app,
//       request,
//       origin,
//     } = parsed;
//     console.log(
//       `Authorizer -> componentDidMount -> app: ${app ||
//         null}, code: ${code || null}, error: ${callbackError ||
//         null}, request: ${request || null}`,
//     );

//     // I have a code, call the endpoint and return token
//     if (code) {
//       authenticationService.login(code).then(
//         user => {
//           console.log(
//             'Authorizer -> componentDidMount -> user',
//             user,
//           );

//           const decoded = jwtDecode(user);
//           const appAccess = decoded['https://www.cochlear.com/app'];
//           const userType =
//             decoded['https://www.cochlear.com/user_type'];
//           if (appAccess) {
//             // Gets the cookie that was stored when the user clicked on login or raise service request
//             const getReferrerUrl = Cookies.get('referrerUrl');

//             // Remove cookie as it's no longer needed
//             // We dont want it to stay here anymore
//             Cookies.remove('referrerUrl');

//             console.log(
//               'Authorizer -> getReferrerUrl',
//               getReferrerUrl,
//             );

//             // TODO check app value and return to app homepage instead if referrer doesnt exist
//             const goToPage =
//               getReferrerUrl ||
//               `${CochlearHomePage}${country}/${lang}/home`;

//             window.location.replace(goToPage);
//             return null;
//           }
//           // catch null and undefined (user has token but no app authorization)
//           if (!appAccess) {
//             // check if provisional
//             if (userType === 'Provisional') {
//               // show provisional error message with logout
//               this.setError('provisional');
//             } else {
//               // show generic error page with logout
//               this.setError('generic');
//             }
//           }
//         },
//         error => {
//           console.log(error);
//           this.setError('error', error);
//         },
//       );
//     }

//     // I have a request to logout
//     if (request) {
//       // call logout service and get a response.
//       authenticationService
//         .logout()
//         .then(value => {
//           console.log('success: ', value);
//         })
//         .catch(error => {
//           console.log('error: ', error);
//         })
//         .finally(() => {
//           console.log('logging out user');

//           // Gets the cookie that was stored when the user clicked on login or raise service request
//           const getReferrerUrl = Cookies.get('referrerUrl');

//           // Remove cookie as it's no longer needed
//           // We dont want it to stay here anymore
//           Cookies.remove('referrerUrl');

//           // add the http protocol if it doesnt exist
//           const returnedOrigin = origin && addhttp(origin);
//           console.log(
//             '🚀 ~ file: Authorizer.js ~ line 137 ~ Authorizer ~ .finally ~ returnedOrigin',
//             returnedOrigin,
//           );

//           const goToPage =
//             returnedOrigin ||
//             getReferrerUrl ||
//             `${CochlearHomePage}${country}/${lang}/home`;
//           // eslint-disable-next-line no-undef
//           window.location.replace(
//             `${CIM_RecipientLogout}?logoutURL=${goToPage}`,
//           );
//         });
//     }

//     // code not returned, received an error code instead
//     if (callbackError) {
//       this.setError('error');
//     }
//   }

//   setError(type, error) {
//     const errorStatus =
//       error && error.response ? error.response.status : '';
//     this.setState({
//       error: true,
//       errorType: type,
//       errorStatus: errorStatus || null,
//     });
//   }

//   render() {
//     const { location } = this.props;
//     const { error, errorType, errorStatus } = this.state;

//     const { search } = location;
//     const parsed = queryString.parse(search);
//     // TODO: look for app value here, if it exists pass it to error page
//     // it can then be used as fallback for callback url if needed
//     console.log('Authorizer -> render -> parsed', parsed);
//     const { code, error: callbackError, request } = parsed;

//     console.log('render -> code: ', code || null);
//     console.log('render -> error: ', callbackError || null);

//     const SkipLink = () => {
//       return (
//         <a
//           id="skiplink"
//           className="is-sr-only-focusable"
//           href="#skipToContent"
//         >
//           <div className="container">
//             <span className="skiplink-text">
//               Skip to main content
//             </span>
//           </div>
//         </a>
//       );
//     };

//     const Navigation = props => <NavbarBasic />;

//     const labelData = {
//       generic: {
//         title: 'You don’t have access to this service.',
//         text: `If you need to access your account right now, contact our <a
//         class="error-message__link"
//         href="https://www.cochlear.com/us/en/connect/contact-us/contact-us-recipient"
//         target="_blank"
//         rel="noopener noreferrer"
//       >customer support</a> team.`,
//       },
//       provisonal: {
//         title: 'We’re working to set up your account.',
//         text: `If you need to access your account right now, contact our <a
//         class="error-message__link"
//         href="https://www.cochlear.com/us/en/connect/contact-us/contact-us-recipient"
//         target="_blank"
//         rel="noopener noreferrer"
//       > customer support</a> team.`,
//       },
//       error: {
//         title: 'That’s strange, it seems something went wrong.',
//         text: `If you need to access your account right now, contact our <a
//         class="error-message__link"
//         href="https://www.cochlear.com/us/en/connect/contact-us/contact-us-recipient"
//         target="_blank"
//         rel="noopener noreferrer"
//       > customer support</a> team.`,
//       },
//     };

//     if (error) {
//       return (
//         <>
//           <SkipLink />
//           <Navigation />
//           <main className="site__content">
//             <div id="skipToContent" tabIndex="-1" />
//             <div className="content__wrapper">
//               <div className="content__centered--default">
//                 {/* back button should log out user */}
//                 <AuthorizationError
//                   errorType={errorType}
//                   labelData={labelData[errorType]}
//                   errorResponse={errorStatus}
//                   handleLogout
//                 />
//               </div>
//             </div>
//           </main>
//           <Footer />
//         </>
//       );
//     }

//     /* visitors will get redirect to the login page if they dont have a code or error */
//     if (!callbackError && !code && !request) {
//       console.log('no code- redirecting user...');
//       // if window is undefined, redirect to login page wont work
//       if (typeof window !== 'undefined') {
//         // remove cookie and redirect to login page
//         authenticationService.renew();
//         return false;
//       }
//       return <Redirect to={`/${country}/${lang}/`} />;
//     }

//     /* render a spinner whilst the background logic takes place */
//     return (
//       <div className="section spinner" style={{ flexGrow: 1 }}>
//         <div className="spinner--loading" />
//       </div>
//     );
//   }
// }

// export default Authorizer;
