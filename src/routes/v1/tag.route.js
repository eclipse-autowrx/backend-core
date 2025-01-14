const express = require('express');
// const { db } = require('../../config/firebase');
const { tagValidation } = require('../../validations');
const { tagController } = require('../../controllers');
const validate = require('../../middlewares/validate');

const router = express.Router();

// router.route('/').post(validate(tagValidation.createTag), tagController.createTag);
// router
//   .route('/categories')
//   .get(validate(tagValidation.listTagCategories), tagController.listTagCategories)
//   .post(validate(tagValidation.createTagCategory), tagController.createTagCategory);
// router.route('/categories/:id').put(validate(tagValidation.updateTagCategory), tagController.updateTagCategory);

// router.get('/categories/:tenantId', async (req, res) => {
//   try {
//     const { tenantId } = req.params;
//     const response = await db.collection('tags').where('tenant_id', '==', tenantId).get();
//     const result = response.docs.map((doc) => doc.data());
//     res.send(result);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });

// router.post('/createTag', async (req, res) => {
//   try {
//     const { newTag, newTagCategory, id, tenantId } = req.body;
//     const docRef = db.collection('tags').doc(id);
//     const docSnap = await docRef.get();
//     if (docSnap.exists) {
//       const existingTagCategory = docSnap.data();
//       const existingTag = existingTagCategory?.tags[newTag.name];
//       if (existingTag) {
//         // console.warn("Tag already exists.");
//         return res.send();
//       }
//       await docRef.update({ [`tags.${newTag.name}`]: newTag });
//     } else {
//       const tagCategoryObject = {
//         ...newTagCategory,
//         id,
//         tenant_id: tenantId,
//         tags: {
//           [newTag.name]: newTag,
//         },
//       };
//       await docRef.set(tagCategoryObject);
//     }
//     res.send(id);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });

// router.put('/tagCategory/:categoryId', async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const docRef = await db.collection('tags').doc(categoryId);
//     const docData = await (await docRef.get()).data();
//     const newData = {
//       ...docData,
//       tags: {
//         ...(docData.tags || {}),
//         ...(req.body.tags || {}),
//       },
//     };
//     const response = await drouter.post('/tagCategory', async (req, res) => {
//   try {
//     const response = await db.collection('tags').doc(req.body.id).set(req.body);
//     res.send(response);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });;
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });
// router.post('/tagCategory', async (req, res) => {
//   try {
//     const response = await db.collection('tags').doc(req.body.id).set(req.body);
//     res.send(response);
//   } catch (error) {
//     res.status(400).send('error');
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//   }
// });

module.exports = router;
