const { db } = require('../../config/firebase');

const listReleasedPrototypes = async (req, res) => {
  try {
    const retPrototypes = [];

    const prototypes = await db
      .collection('project')
      .where('state', '==', 'released')
      .select('description', 'name', 'model_id', 'image_file', 'tags')
      .get();

    if (!prototypes.empty) {
      prototypes.forEach((prototype) => {
        retPrototypes.push({
          id: prototype.id,
          description: prototype.data().description,
          name: prototype.data().name,
          model_id: prototype.data().model_id,
          image_file: prototype.data().image_file,
          tags: prototype.data().tags,
        });
      });
    }

    res.json(retPrototypes);
  } catch (error) {
    res.status(400).json(String(error));
  }
};

module.exports = {
  listReleasedPrototypes,
};
