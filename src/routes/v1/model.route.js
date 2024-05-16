const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
const validate = require('../../middlewares/validate');
const modelValidation = require('../../validations/model.validation');
const modelController = require('../../controllers/model.controller');
const auth = require('../../middlewares/auth');
const { listModelLite } = require('../../controllers/modelControllers/listModelLite');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/getModel/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const model = (await db.collection('model').doc(modelId).get()).data();
    res.send(model);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.get('/getModels', async (req, res) => {
  try {
    const models = [];
    let { accessibleModelIds } = req.query;

    let query = db.collection('model');

    if (accessibleModelIds) {
      accessibleModelIds = accessibleModelIds.split(',');
      query = query.where('model_id', 'in', accessibleModelIds);
    }

    const response = await query.get();
    response.forEach((doc) => {
      models.push(doc.data());
    });
    res.send(models);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.get('/listModelLite', listModelLite);
router.put('/saveModelName/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const { name } = req.body;
    await db.collection('model').doc(modelId).update({
      name,
    });
    res.send('Saved model name successfully');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.put('/saveModelSkeleton/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const { skeleton } = req.body;
    await db.collection('model').doc(modelId).update({
      skeleton,
    });
    res.send('Saved model skeleton successfully');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.post('/newModel', async (req, res) => {
  try {
    const {
      custom_apis,
      cvi,
      main_api,
      model_home_image_file,
      model_files,
      name,
      visibility,
      tenant_id,
      vehicle_category,
      property,
      userUid,
    } = req.body;

    const newModelRef = db.collection('model').doc();
    await newModelRef.set({
      id: newModelRef.id,
      custom_apis,
      created: {
        created_time: Timestamp.now(),
        user_uid: userUid,
      },
      cvi,
      main_api,
      model_home_image_file,
      model_files,
      name,
      visibility,
      tenant_id,
      vehicle_category,
      property,
    });

    if (newModelRef) {
      res.send(newModelRef.id);
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.put('/updateModel/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const data = req.body;
    await db.collection('model').doc(modelId).update(data);
    res.send('Updated model successfully');
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});
router.route('/').post(auth(), validate(modelValidation.createModel), modelController.createModel);

module.exports = router;
