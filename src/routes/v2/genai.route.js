const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../../config/config');
const { proxyHandler } = require('../../config/proxyHandler');
const { checkPermission } = require('../../middlewares/permission');
const { PERMISSIONS } = require('../../config/roles');
const auth = require('../../middlewares/auth');
const router = require('express').Router();

router.use(auth(), checkPermission(PERMISSIONS.GENERATIVE_AI));

const proxyMiddleware = config.services.genAI.url
  ? createProxyMiddleware({
      target: config.services.genAI.url,
      changeOrigin: true,
    })
  : null;

router.use(proxyHandler('GenAI service', proxyMiddleware));

module.exports = router;
