const express = require('express');
const {
  appName,
  language,
  sitecoreDistPath,
} = require('../package.json').config;
const scProxy = require('@sitecore-jss/sitecore-jss-proxy').default;
const {
  createDefaultDisconnectedServer,
} = require('@sitecore-jss/sitecore-jss-dev-tools');
const app = require('../build/server.bundle');

const server = express();

// the port the disconnected app will run on
// Node hosts usually pass a port to run on using a CLI argument
//const port = process.argv[2] || 8080;
const port = process.env.PORT || 8080;

// create a JSS disconnected-mode server
createDefaultDisconnectedServer({
  port,
  appRoot: __dirname,
  appName,
  language,
  watchPaths: [],
  server,
  afterMiddlewareRegistered: expressInstance => {
    // to make disconnected SSR work, we need to add additional middleware (beyond mock layout service) to handle
    // local static build artifacts, and to handle SSR by loopback proxying to the disconnected
    // layout service on the same express server

    expressInstance.use((req, res, next) => {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE',
      );
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    // Serve static app assets from local /build folder into the sitecoreDistPath setting
    // Note: for Angular and Vue samples, change /build to /dist to match where they emit build artifacts
    expressInstance.use(
      sitecoreDistPath,
      express.static('build', {
        fallthrough: false, // force 404 for unknown assets under /dist
      }),
    );

    const ssrProxyConfig = {
      // api host = self, because this server hosts the disconnected layout service
      apiHost: `https://author.sit.cms.cochlear.cloud`,
      layoutServiceRoute: '/sitecore/api/layout/render/jss',
      apiKey: '{8802F4A2-D528-4422-BAE3-4373372DE1AD}',
      pathRewriteExcludeRoutes: [
        '/dist',
        '/build',
        '/assets',
        '/sitecore/api',
        '/api',
      ],
      debug: true,
      maxResponseSizeBytes: 10 * 1024 * 1024,
      proxyOptions: {
        secure: false,
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    };

    // For any other requests, we render app routes server-side and return them
    expressInstance.use(
      '*',
      scProxy(app.renderView, ssrProxyConfig, app.parseRouteUrl),
    );
  },
});
