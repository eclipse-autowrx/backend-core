const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { prototypeValidation } = require('../../validations');
const { prototypeController } = require('../../controllers');
const { checkPermission } = require('../../middlewares/permission');
const { PERMISSIONS } = require('../../config/roles');
const config = require('../../config/config');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(prototypeValidation.createPrototype), prototypeController.createPrototype)
  .get(
    auth({
      optional: !config.strictAuth,
    }),
    validate(prototypeValidation.listPrototypes),
    prototypeController.listPrototypes
  );

router.route('/recent').get(auth(), prototypeController.listRecentPrototypes);

router
  .route('/:id')
  .get(
    auth({
      optional: !config.strictAuth,
    }),
    validate(prototypeValidation.getPrototype),
    prototypeController.getPrototype
  )
  .patch(
    auth(),
    checkPermission(PERMISSIONS.READ_MODEL),
    validate(prototypeValidation.updatePrototype),
    prototypeController.updatePrototype
  )
  .delete(
    auth(),
    checkPermission(PERMISSIONS.READ_MODEL),
    validate(prototypeValidation.deletePrototype),
    prototypeController.deletePrototype
  );

module.exports = router;
