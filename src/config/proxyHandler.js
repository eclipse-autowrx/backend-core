const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const httpStatus = require('http-status');
const logger = require('./logger');
const { match } = require('path-to-regexp');

// Paths that should not parse body for proxy purpose. Parsing body will potentially cause the request to be consumed and not available for proxy.
const excludePaths = ['/v2/file', '/v2/genai', '/v2/homologation']
  .filter(Boolean)
  .map((path) => [path, `${path}/*any`])
  .flat();

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

    return proxy(req, res, (err) => {
      if (err) {
        logger.error(`Proxy error for ${name}: %o`, err?.message || err);
      }
    });
  };

/**
 *
 * @param {import('express').Request} req
 */
const shouldParseBody = (req) => {
  const compilers = excludePaths.map((path) => match(path, { decode: decodeURIComponent }));
  return !compilers.some((compiler) => compiler(req.path));
};

module.exports.setupProxy = setupProxy;
module.exports.proxyHandler = proxyHandler;
module.exports.shouldParseBody = shouldParseBody;
