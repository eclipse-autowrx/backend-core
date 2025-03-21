const config = require('../../config/config');
const { PERMISSIONS } = require('../../config/roles');
const { changeLogController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const { checkPermission } = require('../../middlewares/permission');
const router = require('express').Router();

router.route('/').get(
  auth({
    optional: !config.strictAuth,
  }),
  checkPermission(PERMISSIONS.ADMIN),
  changeLogController.listChangeLogs
);

module.exports = router;
