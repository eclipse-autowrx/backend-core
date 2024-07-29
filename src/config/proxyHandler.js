const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');

const setupProxy = (app) => {
  app.use(
    '/v2/file',
    createProxyMiddleware({
      target: `http://upload:${config.services.upload.port}`,
      changeOrigin: true,
    })
  );
};

module.exports = setupProxy;
