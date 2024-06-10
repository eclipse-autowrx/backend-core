const express = require('express');

const router = express.Router();
const permissionController = require('../../controllers/permission.controller');
const validate = require('../../middlewares/validate');
const { permissionValidation } = require('../../validations');
const auth = require('../../middlewares/auth');

// Assign role to user
router.post('/assign', permissionController.assignRoleToUser);

// Get roles of a user
router.get('/user/:user', permissionController.getUserRoles);

// Get users of a role
router.get('/role/:role', permissionController.getRoleUsers);

router.get('/self', auth(), validate(permissionValidation.getSelfUsers), permissionController.getSelfRoles);

module.exports = router;
