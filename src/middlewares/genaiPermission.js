const httpStatus = require('http-status');
const { permissionService } = require('../services');
const { PERMISSIONS } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const hasGenAIPermission = async (userId) => {
  if (!userId) {
    return false;
  }

  return permissionService.hasPermission(userId, PERMISSIONS.GENERATIVE_AI);
};

const genaiPermission = async (req, _, next) => {
  const { user } = req.body;

  if (!(await hasGenAIPermission(user || req.user?.id))) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to use GenAI service'));
  }
  next();
};

module.exports = genaiPermission;
