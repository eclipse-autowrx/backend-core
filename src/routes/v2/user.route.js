const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const { checkPermission } = require('../../middlewares/permission');
const { PERMISSIONS } = require('../../config/roles');
const config = require('../../config/config');

const router = express.Router();

router
  .route('/')
  .post(auth(), checkPermission(PERMISSIONS.MANAGE_USERS), validate(userValidation.createUser), userController.createUser)
  .get(
    auth({
      optional: !config.strictAuth,
    }),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route('/self')
  .get(auth(), userController.getSelf)
  .patch(auth(), validate(userValidation.updateSelfUser), userController.updateSelf);

router
  .route('/:userId')
  .get(
    auth({
      optional: !config.strictAuth,
    }),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(auth(), checkPermission(PERMISSIONS.MANAGE_USERS), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), checkPermission(PERMISSIONS.MANAGE_USERS), validate(userValidation.deleteUser), userController.deleteUser);

router.route('/self/promote').post(auth(), userController.selfPromote);

module.exports = router;
