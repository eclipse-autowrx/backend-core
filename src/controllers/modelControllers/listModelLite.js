const { db } = require('../../config/firebase');

const listModelLite = async (req, res) => {
  try {
    const retModels = [];

    const models = await db
      .collection('model')
      .where('tenant_id', '==', process.env.TENANT_ID)
      .select('name', 'visibility', 'model_home_image_file', 'created')
      .get();

    if (!models.empty) {
      models.forEach((model) => {
        retModels.push({
          id: model.id,
          visibility: model.data().visibility,
          name: model.data().name,
          created: model.data().created,
          model_home_image_file: model.data().model_home_image_file,
        });
      });
    }

    res.json(retModels);
  } catch (error) {
    res.status(400).json(String(error));
  }
};

module.exports = {
  listModelLite,
};
