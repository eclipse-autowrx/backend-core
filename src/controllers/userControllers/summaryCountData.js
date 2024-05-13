const { Timestamp } = require('firebase-admin/firestore');
const dayjs = require('dayjs');
const httpStatus = require('http-status');
const { db } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions');

const summaryCountData = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let from = Timestamp.fromDate(dayjs().startOf('month').toDate());
    let to = Timestamp.fromDate(dayjs().endOf('month').toDate());

    if (fromDate) from = Timestamp.fromDate(dayjs(fromDate).toDate());
    if (toDate) to = Timestamp.fromDate(dayjs(toDate).toDate());

    const retData = {
      users: [],
      models: [],
      prototypes: [],
    };

    // Query users created within the specified timeframe
    const users = await db
      .collection('user')
      .where('tenant_id', '==', TENANT_ID)
      .where('created_time', '>=', from)
      .where('created_time', '<=', to)
      .select('uid', 'email', 'name', 'provider', 'image_file', 'created_time')
      .get();
    if (!users.empty) {
      users.forEach((user) => {
        retData.users.push({
          id: user.id,
          uid: user.data().uid,
          email: user.data().email,
          name: user.data().name,
          provider: user.data().provider,
          image_file: user.data().image_file,
          created_time: user.data().created_time.toDate(),
        });
      });
    }

    // Query models created within the specified timeframe
    const models = await db
      .collection('model')
      .where('tenant_id', '==', TENANT_ID)
      .where('created.created_time', '>=', from)
      .where('created.created_time', '<=', to)
      .select('name', 'model_home_image_file', 'created')
      .get();
    if (!models.empty) {
      models.forEach((model) => {
        retData.models.push({
          id: model.id,
          name: model.data().name,
          image_file: model.data().model_home_image_file,
          created_time: model.data().created.created_time.toDate(),
          created_by: model.data().created.user_uid,
        });
      });
    }

    // Query prototypes created within the specified timeframe
    const prototypes = await db
      .collection('project')
      .where('created.created_time', '>=', from)
      .where('created.created_time', '<=', to)
      .select('name', 'model_home_image_file', 'created')
      .get();
    if (!prototypes.empty) {
      prototypes.forEach((prototype) => {
        retData.prototypes.push({
          id: prototype.id,
          name: prototype.data().name,
          image_file: prototype.data().model_home_image_file,
          created_time: prototype.data().created.created_time.toDate(),
          created_by: prototype.data().created.user_uid,
        });
      });
    }

    res.status(httpStatus.OK).json(retData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in summaryCountData:', error);
    res.status(httpStatus.BAD_REQUEST).json({ error: error.toString() });
  }
};

module.exports = {
  summaryCountData,
};
