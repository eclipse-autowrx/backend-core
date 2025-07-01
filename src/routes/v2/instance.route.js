// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const instanceValidation = require('../../validations/instance.validation');
const instanceController = require('../../controllers/instance.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(instanceValidation.createInstance), instanceController.createInstance)
  .get(validate(instanceValidation.getInstances), instanceController.getInstances);

router
  .route('/:instanceId')
  .get(validate(instanceValidation.getInstance), instanceController.getInstance)
  .patch(auth(), validate(instanceValidation.updateInstance), instanceController.updateInstance)
  .delete(auth(), validate(instanceValidation.deleteInstance), instanceController.deleteInstance);

module.exports = router;
