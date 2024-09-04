const httpStatus = require('http-status');
const { permissionService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {string} permission
 * @param {string} [type]
 */
function checkPermission(permission, type) {
  return async (req, res, next) => {
    const { user } = req;
    const { id: paramId, modelId: paramModelId, prototypeId: paramPrototypeId } = req.params;
    const id = paramId || paramModelId || paramPrototypeId;
    try {
      const isAuthorized = await permissionService.hasPermission(user.id, permission, id, type);
      if (!isAuthorized) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {
  checkPermission,
};
