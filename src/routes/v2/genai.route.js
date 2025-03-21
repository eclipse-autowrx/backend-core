const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../../config/config');
const { proxyHandler } = require('../../config/proxyHandler');

const proxyMiddleware = config.services.genAI.url
  ? createProxyMiddleware({
      target: config.services.genAI.url,
      changeOrigin: true,
    })
  : null;

module.exports = proxyHandler('GenAI service', proxyMiddleware);
