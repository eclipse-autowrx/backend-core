const { db } = require('../../config/firebase');

// Controller function to list all prototypes
const listAllPrototypes = async (req, res) => {
  try {
    const retPrototypes = [];

    const prototypesSnapshot = await db
      .collection('project')
      .select('description', 'name', 'model_id', 'image_file', 'tags', 'apis', 'rated_by')
      .get();

    if (!prototypesSnapshot.empty) {
      prototypesSnapshot.forEach((prototypeDoc) => {
        const prototypeData = prototypeDoc.data();
        retPrototypes.push({
          id: prototypeDoc.id,
          description: prototypeData.description,
          name: prototypeData.name,
          model_id: prototypeData.model_id,
          image_file: prototypeData.image_file,
          tags: prototypeData.tags,
          apis: prototypeData.apis,
          rated_by: prototypeData.rated_by,
        });
      });
    }

    return res.status(200).json(retPrototypes);
  } catch (error) {
    return res.status(400).send(error.toString());
  }
};

module.exports = { listAllPrototypes };
