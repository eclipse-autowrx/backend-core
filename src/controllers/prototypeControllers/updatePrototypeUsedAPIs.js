const httpStatus = require('http-status');
const { db } = require('../../config/firebase');

const updatePrototypeUsedAPIs = async (req, res) => {
  const { id, usedAPIs } = req.body;

  if (!id || !usedAPIs) {
    res.status(httpStatus.BAD_REQUEST).json({ error: 'id and usedAPIs are required.' });
    return;
  }

  try {
    const prototypeDoc = await db.collection('project').doc(id).get();

    if (!prototypeDoc.exists) {
      res.status(httpStatus.NOT_FOUND).json({ error: 'Prototype not found.' });
      return;
    }

    const useApiNames = usedAPIs.map((api) => api.name);
    await db.collection('project').doc(id).update({ 'apis.VSS': useApiNames });

    res.status(httpStatus.OK).json({ message: 'Successfully updated prototype used APIs.' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating prototype used APIs:', error);
    res.status(httpStatus.BAD_REQUEST).json({ error: String(error) });
  }
};

module.exports = {
  updatePrototypeUsedAPIs,
};
