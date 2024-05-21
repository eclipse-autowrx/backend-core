const dayjs = require('dayjs');
const httpStatus = require('http-status');
const { db } = require('../config/firebase');
const permissions = require('../controllers/permissions');
const { cacheAxios, logAxios } = require('../config/axios');
const ApiError = require('../utils/ApiError');

const getRecentPrototypes = async (userId) => {
  try {
    // Fetch recent activities
    const recentData = (await cacheAxios.get(`/get-recent-activities/${userId}`)).data;
    const prototypesId = recentData.map((d) => d.referenceId);
    if (prototypesId.length === 0) return [];

    // Fetch prototype documents from Firestore
    const response = await db.collection('project').where('id', 'in', prototypesId).get();
    let results = [];
    if (response.empty) return [];

    response.docs.forEach((doc) => {
      const data = doc.data();
      const prototype = recentData.find((d) => d.referenceId === data.id);
      results.push({
        ...data,
        page: prototype?.page || '',
        time: prototype?.time || new Date(),
      });
    });

    results = results.sort((a, b) => dayjs(b.time).unix() - dayjs(a.time).unix());

    // Fetch model documents from Firestore
    const modelIds = results.map((r) => r.model_id);
    if (modelIds.length === 0) return [];
    const modelResponse = await db.collection('model').where('id', 'in', modelIds).get();
    const models = modelResponse.docs.map((doc) => doc.data());

    const promises = results.map(async (result) => {
      const model = models.find((m) => m.id === result.model_id);
      if (!model) return;

      const permission = permissions.MODEL({ uid: userId }, model);
      if (!permission.canRead()) return;

      try {
        const runTimesResponse = await logAxios.get('/', {
          params: {
            ref_id: result.id,
            type: 'run-prototype',
          },
        });
        // eslint-disable-next-line no-param-reassign
        result.model = model;
        // eslint-disable-next-line no-param-reassign
        result.executedTimes = runTimesResponse?.data?.count;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error fetching executed times:', error);
        // eslint-disable-next-line no-param-reassign
        result.model = model;
      }
    });

    await Promise.all(promises);

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while fetching prototypes');
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPrototypes = async (filter, options) => {
  const retPrototypes = [];

  let query = db.collection('project');

  Object.keys(filter).forEach((key) => {
    query = query.where(key, 'in', filter[key].split(',').slice(0, 30));
  });

  const prototypes = await query.select('description', 'name', 'model_id', 'image_file', 'tags', 'apis', 'rated_by').get();

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

  return retPrototypes;
};

module.exports = { getRecentPrototypes, queryPrototypes };
