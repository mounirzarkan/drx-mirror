// import React from 'react';
// import NavbarBasic from './components/global/header/NavbarBasic/NavbarBasic';
// import Footer from './components/global/Footer/Footer';
// import AuthorizationError from './components/AuthorizationError/AuthorizationError';

// class NotAuthorized extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
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
//         title: 'You dont have access to this service.',
//         text: `If you need to access your account right now, contact our <a
//         class="error-message__link"
//         href="https://www.cochlear.com/us/en/connect/contact-us/contact-us-recipient"
//         target="_blank"
//         rel="noopener noreferrer"
//       >customer support</a> team.`,
//       },
//     };

//     return (
//       <>
//         <SkipLink />
//         <Navigation />
//         <main className="site__content">
//           <div id="skipToContent" tabIndex="-1" />
//           <div className="content__wrapper">
//             <div className="content__centered--default">
//               {/* back button should not log out user */}
//               <AuthorizationError
//                 errorType="generic"
//                 labelData={labelData.generic}
//                 handleLogout={false}
//               />
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </>
//     );
//   }
// }

// export default NotAuthorized;
