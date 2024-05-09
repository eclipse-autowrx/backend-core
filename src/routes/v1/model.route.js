const express = require('express');
const validate = require('../../middlewares/validate');
const modelValidation = require('../../validations/model.validation');
const modelController = require('../../controllers/model.controller');
const auth = require('../../middlewares/auth');
const { listModelLite } = require('../../controllers/modelControllers/listModelLite');

const router = express.Router();

router.get('/listModelLite', listModelLite);
router.route('/').post(auth(), validate(modelValidation.createModel), modelController.createModel);

module.exports = router;
