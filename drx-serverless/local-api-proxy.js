/*
To use this for local development, you need to install express and http-proxy-middleware

npm install http-proxy-middleware express --save-dev

and run it as

node local-api-proxy.js

Then you need to change the serverless_offline.yml files of the modules mapped below to match the ports:
eg. for account change httpPort to 3010 and lambdaPort to 3110
eg. for address change httpPort to 3011 and lambdaPort to 3111
*/
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

app.use(
  '/drx/v1/patients/me/',
  createProxyMiddleware({target: 'http://localhost:3010', changeOrigin: true})
);

app.use(
  '/drx/v1/patients/me/address',
  createProxyMiddleware({target: 'http://localhost:3011', changeOrigin: true})
);

app.use(
  '/drx/v1/auth',
  createProxyMiddleware({target: 'http://localhost:3012', changeOrigin: true})
);

app.use(
  '/drx/v1/patients/me/devices',
  createProxyMiddleware({target: 'http://localhost:3013', changeOrigin: true})
);

app.use(
  '/drx/v1/patients/me/orders',
  createProxyMiddleware({target: 'http://localhost:3014', changeOrigin: true})
);

app.use(
  '/drx/v1/patients/me/service-requests',
  createProxyMiddleware({target: 'http://localhost:3015', changeOrigin: true})
);

app.use(
  '/drx/v1/utils',
  createProxyMiddleware({target: 'http://localhost:3016', changeOrigin: true})
);

app.use(
  '/drx/v1/contents/menu',
  createProxyMiddleware({target: 'http://localhost:3017', changeOrigin: true})
);

app.use(
  '/drx/v1/contents/header-footer',
  createProxyMiddleware({target: 'http://localhost:3018', changeOrigin: true})
);

app.use(
  '/drx/v1/cache-refresh',
  createProxyMiddleware({target: 'http://localhost:3019', changeOrigin: true})
);

/*
/drx/v1/auth

/drx/v1/patients/me
/drx/v1/patients/me/address
/drx/v1/patients/me/devices
/drx/v1/patients/me/orders
/drx/v1/patients/me/service-requests

/drx/v1/profile
/drx/v1/userid

/drx/v1/contents/menu
/drx/v1/contents/header-footer

/drx/v1/cache-refresh
/drx/v1/utils/regions
/drx/v1/utils/convert-phone
*/

app.listen(3003, () => {
  console.log(`Server is running on port 3003`);
});
