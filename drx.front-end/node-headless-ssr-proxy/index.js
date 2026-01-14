const express = require('express');
const compression = require('compression');
const scProxy = require('@sitecore-jss/sitecore-jss-proxy').default;
const config = require('./config');
const cors = require('cors');

const server = express();
const port = process.env.PORT || 3000;

// enable gzip compression for appropriate file types
server.use(compression());

// turn off x-powered-by http header
server.settings['x-powered-by'] = false;

// Enable CORS for DRX headless proxy
// Add additional domains here
const allowedOrigins = [
  /\.cochlear\.cloud$/,
  /\.cochlear\.com$/,
  'http://localhost:3000',
  'http://localhost:6006',
  'http://drx-storybook.s3-website-ap-southeast-2.amazonaws.com'];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200, // For legacy browser support
};

server.use(cors(corsOptions));


// Serve static app assets from local /dist folder
server.use(
  '/dist',
  express.static('dist', {
    fallthrough: false, // force 404 for unknown assets under /dist
  })
);

// For any other requests, we render app routes server-side and return them

/* server.use(function (req, res, next) {
  let siteName="drx";
  //append site name parameter as query string before proxying if not default site
  console.log(siteName)

  // It should be enough to set a query through req.query but the sitecore proxy looks for 
  // the index of '?' in the original url to detect query params so we have to append query string
  // to the end of the original url and handle both cases where a query string exists and where it is created

    // we employ the same check as the sitecore proxy here for consistency
    if (req.originalUrl.indexOf('?') > -1) {
      req.originalUrl += `&sc_site=${siteName}`
    } else {
      req.originalUrl += `?sc_site=${siteName}`
    }
    req.query['sc_site'] = siteName
   
  next();
},
scProxy(config.serverBundle.renderView, config, config.serverBundle.parseRouteUrl)
); */
server.use('*', scProxy(config.serverBundle.renderView, config, config.serverBundle.parseRouteUrl));

server.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});
