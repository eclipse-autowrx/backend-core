const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const httpStatus = require('http-status');
const logger = require('./logger');

const setupProxy = (app) => {
  app.use(
    '/v2/file',
    createProxyMiddleware({
      target: `http://upload:${config.services.upload.port}`,
      changeOrigin: true,
    })
  );
};

/**
 *
 * @param {string} name
 * @param {import('http-proxy-middleware').RequestHandler | null} [proxy]
 * @returns
 */
const proxyHandler =
  (name, proxy) =>
  /**
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   */
  (req, res, next) => {
    if (!proxy) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `${name} is not implemented` });
    }

    proxy(req, res, (err) => {
      if (err) {
        logger.error(`Proxy error for ${name}: %o`, err?.message || err);
      }
    });
  };

module.exports.setupProxy = setupProxy;
module.exports.proxyHandler = proxyHandler;
