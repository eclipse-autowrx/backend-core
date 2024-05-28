const express = require('express');
const validate = require('../../middlewares/validate');
const modelValidation = require('../../validations/model.legacy.validation');
const { modelLegacyController } = require('../../controllers');
// const auth = require('../../middlewares/auth');
// const { listModelLite } = require('../../controllers/modelControllers/listModelLite');
// const { db } = require('../../config/firebase');

const router = express.Router();

router
  .route('/')
  .get(validate(modelValidation.listModels), modelLegacyController.listModels)
  .post(validate(modelValidation.createModel), modelLegacyController.createModel);
router
  .route('/:id')
  .get(validate(modelValidation.getModel), modelLegacyController.getModel)
  .put(validate(modelValidation.updateModel), modelLegacyController.updateModel);
router.route('/:id/tag').put(validate(modelValidation.updateTag), modelLegacyController.updateTag);
router.route('/:id/api').delete(validate(modelValidation.deleteApi), modelLegacyController.deleteApi);

// .delete(validate(modelValidation.deleteModel), modelController.deleteModel);

// router.get('/getModel/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const model = (await db.collection('model').doc(modelId).get()).data();
//     res.send(model);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.get('/getModels', async (req, res) => {
//   try {
//     const models = [];
//     let { accessibleModelIds } = req.query;

//     let query = db.collection('model');

//     if (accessibleModelIds) {
//       accessibleModelIds = accessibleModelIds.split(',');
//       query = query.where('model_id', 'in', accessibleModelIds);
//     }

//     const response = await query.get();
//     response.forEach((d) => {
//       models.push(d.data());
//     });
//     res.send(models);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('/saveModelName/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const { name } = req.body;
//     await db.collection('model').doc(modelId).update({
//       name,
//     });
//     res.send('Saved model name successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('/saveModelSkeleton/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const { skeleton } = req.body;
//     await db.collection('model').doc(modelId).update({
//       skeleton,
//     });
//     res.send('Saved model skeleton successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.post('/newModel', async (req, res) => {
//   try {uter.delete('/deleteApi/:id', async (req, res) => {
//   try {
//     const { node_name } = req.query;
//     const { id } = req.params;
//     const modelRef = db.collection('model').doc(id);
//     const model = (await modelRef.get()).data();
//     const custom_apis = model.custom_apis ?? {};
//     const [nesting, name] = divideNodeName(node_name);

//     // eslint-disable-next-line no-restricted-syntax
//     const newCustomApis = Object.keys(custom_apis).reduce((acc, key) => {
//       const value = custom_apis[key];
//       if (nesting === key) {
//         const newValue = {};
//         Object.entries(value).forEach(([k, v]) => {
//           if (k !== name) {
//             newValue[k] = v;
//           }
//         });
//         if (Object.keys(newValue).length) {
//           return { ...acc, [key]: newValue };
//         }
//         return acc;
//       }

//       if (key === node_name || key.startsWith(`${node_name}.`)) return acc;

//       return { ...acc, [key]: custom_apis[key] };
//     }, {});

//     await modelRef.update({ custom_apis: newCustomApis });
//     res.send('Deleted api successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });me,
//       visibility,
//       tenant_id,
//       vehicle_category,
//       property,
//       userUid,
//     } = req.body;

//     const newModelRef = db.collection('model').doc();
//     await newModelRef.set({
//       id: newModelRef.id,
//       custom_apis,
//       created: {
//         created_time: Timestamp.now(),
//         user_uid: userUid,
//       },
//       cvi,
//       main_api,
//       model_home_image_file,
//       model_files,
//       name,
//       visibility,
//       tenant_id,
//       vehicle_category,
//       property,
//     });

//     if (newModelRef) {
//       res.send(newModelRef.id);
//     } else {
//       res.send(null);
//     }
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });

// router.put('/updateModel/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const { custom_apis, ...data } = req.body;
//     if (custom_apis) {
//       const modelRef = db.collection('model').doc(modelId);
//       const docSnap = await modelRef.get();

//       const parsedCustomApis = JSON.parse(custom_apis);

//       const newCustomApis = docSnap.data().custom_apis || {};

//       Object.entries(parsedCustomApis).forEach(([nesting, value]) => {
//         newCustomApis[nesting] = {
//           ...newCustomApis[nesting],
//           ...value,
//         };
//       });

//       await db.collection('model').doc(modelId).update({
//         custom_apis: newCustomApis,
//       });
//     } else {
//       await db.collection('model').doc(modelId).update(data);
//     }
//     res.send('Updated model successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('updateTag/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const { tag, tagCategory, tagDetail } = req.body;
//     const modelRef = db.collection('model').doc(modelId);
//     const docSnap = await modelRef.get();
//     const existingModel = docSnap.data();
//     const existingTag = existingModel?.tags?.find((t) => t.tag === tag.name && t.tagCategoryId === tagCategory.id);

//     if (existingTag) {
//       return res.status(400).send('Tag already exists');
//     }

//     const newTags = existingModel?.tags ? [...existingModel.tags, tagDetail] : [tagDetail];
//     await modelRef.update({ tags: newTags });
//     res.send('Updated tag successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.put('/roughUpdateTag/:modelId', async (req, res) => {
//   try {
//     const { modelId } = req.params;
//     const { tags } = req.body;
//     await db.collection('model').doc(modelId).update({ tags });
//     res.send('Updated tag successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });

// const divideNodeName = (node_name) => {
//   const parts = node_name.split('.');
//   const [nesting, name] = [parts.slice(0, -1).join('.'), parts.slice(-1)[0]];

//   return [nesting, name];
// };

// router.delete('/deleteApi/:id', async (req, res) => {
//   try {
//     const { node_name } = req.query;
//     const { id } = req.params;
//     const modelRef = db.collection('model').doc(id);
//     const model = (await modelRef.get()).data();
//     const custom_apis = model.custom_apis ?? {};
//     const [nesting, name] = divideNodeName(node_name);

//     // eslint-disable-next-line no-restricted-syntax
//     const newCustomApis = Object.keys(custom_apis).reduce((acc, key) => {
//       const value = custom_apis[key];
//       if (nesting === key) {
//         const newValue = {};
//         Object.entries(value).forEach(([k, v]) => {
//           if (k !== name) {
//             newValue[k] = v;
//           }
//         });
//         if (Object.keys(newValue).length) {
//           return { ...acc, [key]: newValue };
//         }
//         return acc;
//       }

//       if (key === node_name || key.startsWith(`${node_name}.`)) return acc;

//       return { ...acc, [key]: custom_apis[key] };
//     }, {});

//     await modelRef.update({ custom_apis: newCustomApis });
//     res.send('Deleted api successfully');
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.route('/').post(auth(), validate(modelValidation.createModel), modelController.createModel);

module.exports = router;
