const express = require('express');

const router = express.Router();
const permissionController = require('../../controllers/permission.controller');
const validate = require('../../middlewares/validate');
const { permissionValidation } = require('../../validations');
const auth = require('../../middlewares/auth');

router.get('/self', auth(), validate(permissionValidation.getSelfUsers), permissionController.getSelfRoles);

module.exports = router;
