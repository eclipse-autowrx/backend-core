const express = require('express');
const { db } = require('../../config/firebase');

const router = express.Router();

router.get('/categories/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const response = await db.collection('tags').where('tenant_id', '==', tenantId).get();
    const result = response.docs.map((doc) => doc.data());
    res.send(result);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

router.post('/createTag', async (req, res) => {
  try {
    const data = req.body;
    const docRef = db.collection('tags').doc(data.id);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const existingTagCategory = docSnap.data();
      const existingTag = existingTagCategory?.tags[data.newTag.name];
      if (existingTag) {
        // console.warn("Tag already exists.");
        return res.send();
      }
      await docRef.update({ [`tags.${data.newTag.name}`]: data.newTag });
    } else {
      const tagCategoryObject = {
        ...data.newTagCategory,
        id: data.id,
        tenant_id: data.tenantId,
        tags: {
          [data.newTag.name]: data.newTag,
        },
      };
      await docRef.set(tagCategoryObject);
    }
    res.send(data.id);
  } catch (error) {
    res.status(400).send('error');
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
});

module.exports = router;
