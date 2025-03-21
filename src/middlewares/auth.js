const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { default: axios } = require('axios');
const passport = require('passport');
const logger = require('../config/logger');

// Authentication middleware
const auth =
  ({ optional = false } = {}) =>
  async (req, res, next) => {
    try {
      let user;
      // If auth service url is provided, use it to authenticate the user
      if (config.services.auth.url) {
        const response = await axios.post(config.services.auth.url, req.body, {
          headers: req.headers,
        });
        user = response?.data?.user;
      } else {
        // If auth service url is not provided, use passport to authenticate the user
        user = await new Promise((resolve, reject) => {
          passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || info || !user) {
              return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
            }
            resolve(user);
          })(req, res, next);
        });
      }

      if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');

      req.user = user;
      next();
    } catch (error) {
      // If the middleware is optional, call the next middleware
      if (optional) next();
      else {
        logger.error(`Failed to authenticate user: %o`, error?.message || error);
        next(error);
      }
    }
  };

module.exports = auth;
