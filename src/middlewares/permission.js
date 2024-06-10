const httpStatus = require('http-status');
const { permissionService } = require('../services');
const ApiError = require('../utils/ApiError');

function checkPermission(permission, type, outerId) {
  return async (req, res, next) => {
    const { user } = req;
    const { id: paramId, modelId: paramModelId, prototypeId: paramPrototypeId } = req.params;
    let id = outerId || paramId;
    if (type === 'model') {
      id = id || paramModelId;
    } else if (type === 'prototype') {
      id = id || paramPrototypeId;
    }
    const isAuthorized = await permissionService.hasPermission(user.id, permission, type, id);
    if (!isAuthorized) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
    return next();
  };
}

module.exports = {
  checkPermission,
};
