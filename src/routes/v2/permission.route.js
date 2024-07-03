const express = require('express');

const router = express.Router();
const permissionController = require('../../controllers/permission.controller');
const validate = require('../../middlewares/validate');
const { permissionValidation } = require('../../validations');
const auth = require('../../middlewares/auth');
const { PERMISSIONS } = require('../../config/roles');
const { checkPermission } = require('../../middlewares/permission');

router.get('/self', auth(), validate(permissionValidation.getSelfUsers), permissionController.getSelfRoles);
router.get('/', auth(), validate(permissionValidation.getPermission), permissionController.getPermission);
router.get('/roles', auth(), permissionController.getRoles);
router.post(
  '/',
  auth(),
  checkPermission(PERMISSIONS.MANAGE_USERS),
  validate(permissionValidation.assignRoleToUser),
  permissionController.assignRoleToUser
);

module.exports = router;
