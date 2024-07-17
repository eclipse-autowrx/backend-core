const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { auth: firebaseAuth } = require('../config/firebase');
const { permissionService } = require('../services');
const { PERMISSIONS } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const config = require('../config/config');

const hasGenAIPermission = async (userId) => {
  if (!userId) {
    return false;
  }

  if (mongoose.Types.ObjectId.isValid(userId)) {
    try {
      return await permissionService.hasPermission(userId, PERMISSIONS.GENERATIVE_AI);
    } catch (error) {
      return false;
    }
  }

  try {
    const record = (await firebaseAuth.getUser(userId)).toJSON();

    if (record && config.genAI.allowedEmails.includes(record.email)) {
      return true;
    }
  } catch (error) {
    logger.error(error);
    return false;
  }
  return false;
};

const genaiPermission = async (req, _, next) => {
  const { user } = req.body;

  if (!(await hasGenAIPermission(user || req.user?.id))) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to use GenAI service'));
  }
  next();
};

module.exports = genaiPermission;
