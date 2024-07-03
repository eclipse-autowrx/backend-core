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
  app.use(
    '/v2/log',
    createProxyMiddleware({
      target: `http://172.17.0.1:${config.services.log.port}`,
    })
  );
};

module.exports = setupProxy;
