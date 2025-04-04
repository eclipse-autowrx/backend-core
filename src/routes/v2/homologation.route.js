const express = require('express');
const config = require('../../config/config');
const auth = require('../../middlewares/auth');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { proxyHandler } = require('../../config/proxyHandler');

const router = express.Router();

router.use(
  auth({
    optional: !config.strictAuth,
  })
);

const proxyMiddleware = config.services.homologation.url
  ? createProxyMiddleware({
      target: config.services.homologation.url,
      changeOrigin: true,
    })
  : null;

router.use(proxyHandler('Homologation service', proxyMiddleware));

module.exports = router;
