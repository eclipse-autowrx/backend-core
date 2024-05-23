// const { Timestamp } = require('firebase-admin/firestore');
const express = require('express');
// const { updatePrototypeUsedAPIs } = require('../../controllers/prototypeControllers/updatePrototypeUsedAPIs');
// const { getRecentPrototypes } = require('../../controllers/prototypeControllers/getRecentPrototypes');
// const { db } = require('../../config/firebase');
const { prototypeLegacyController: prototypeController } = require('../../controllers');
const { prototypeLegacyValidation } = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

router
  .route('/')
  .get(validate(prototypeLegacyValidation.listPrototypes), prototypeController.listPrototypes)
  .post(validate(prototypeLegacyValidation.createPrototype), prototypeController.createPrototype);
router
  .route('/:id')
  .put(validate(prototypeLegacyValidation.updatePrototype), prototypeController.updatePrototype)
  .delete(validate(prototypeLegacyValidation.deletePrototype), prototypeController.deletePrototype);

router
  .route('/recent')
  .get(validate(prototypeLegacyValidation.getRecentPrototypes), prototypeController.getRecentPrototypes);
// router.post('/updatePrototypeUsedAPIs', updatePrototypeUsedAPIs);
// router.get('/recentPrototypes/:userId', getRecentPrototypes);
// router.put('/savePrototypeCode/:prototypeId', async (req, res) => {
//   try {
//     const { prototypeId } = req.params;
//     const { code } = req.body;
//     await db.collection('project').doc(prototypeId).update({
//       code,
//     });
//     res.send('Code saved successfully');
//   } catch (error) {
//     res.status(400).json({ error: String(error) });
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.get('/', async (req, res) => {
//   const { model_id } = req.query; // Assuming model_id is sent in the body of the POST request

//   try {
//     const response = await db.collection('project').where('model_id', '==', model_id).get();
//     res.send(response.docs.map((doc) => doc.data()));
//   } catch (error) {
//     res.status(400).json({ error: String(error) });
//   }
// });
// router.put('/savePrototypeSkeleton/:prototypeId', async (req, res) => {
//   try {
//     const { prototypeId } = req.params;
//     const { skeleton } = req.body;
//     await db.collection('project').doc(prototypeId).update({
//       skeleton,
//     });
//     res.send('Saved prototypes skeleton successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('/saveWidgetConfig/:prototypeId', async (req, res) => {
//   try {
//     const { prototypeId } = req.params;
//     const { widgetConfig } = req.body;
//     await db.collection('project').doc(prototypeId).update({
//       widget_config: widgetConfig,
//     });
//     res.send('Saved prototypes widgetConfig successfully');
//   } catch (error) {
//     res.status(400).send('error');getPrototypes
//     let { modelIds } = req.query;

//     let query = db.collection('project');

//     if (modelIds) {
//       modelIds = modelIds.split(',');
//       query = query.where('model_id', 'in', modelIds.slice(0, 30));
//     }

//     const response = await query.get();
//     response.forEach((doc) => {
//       prototypes.push(doc.data());
//     });
//     res.send(prototypes);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.post('/newPrototype', async (req, res) => {
//   try {
//     const newDocRef = db.collection('project').doc();
//     const data = req.body;
//     data.id = newDocRef.id;
//     data.created = {
//       created_time: Timestamp.now(),
//       user_uid: req.body.userId,
//     };
//     await newDocRef.set(req.body);
//     res.send(newDocRef.id);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('/updatePrototype/:prototypeId', async (req, res) => {
//   try {
//     const { prototypeId } = req.params;
//     const data = req.body;
//     await db.collection('project').doc(prototypeId).update(data);
//     res.send('Updated prototype successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.delete('/:prototypeId', async (req, res) => {
//   try {
//     const { prototypeId } = req.params;
//     await db.collection('project').doc(prototypeId).delete();
//     res.send('Deleted prototype successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
module.exports = router;
