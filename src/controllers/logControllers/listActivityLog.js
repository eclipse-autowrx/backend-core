const { Timestamp } = require('firebase-admin/firestore');
const dayjs = require('dayjs');
const httpStatus = require('http-status');
const { db } = require('../../config/firebase');

const listActivityLog = async (req, res) => {
  try {
    const { fromDate, toDate, logType, create_by } = req.query;

    let from = Timestamp.fromDate(dayjs().startOf('month').toDate());
    let to = Timestamp.fromDate(dayjs().endOf('month').toDate());

    if (fromDate) from = Timestamp.fromDate(dayjs(fromDate).toDate());
    if (toDate) to = Timestamp.fromDate(dayjs(toDate).toDate());

    const retData = [];
    let visits = null;

    if (!logType) {
      if (create_by) {
        visits = await db
          .collection('activity_log')
          .where('create_by', '==', create_by)
          .where('created_time', '>=', from)
          .where('created_time', '<=', to)
          .get();
      } else {
        visits = await db.collection('activity_log').where('created_time', '>=', from).where('created_time', '<=', to).get();
      }
    } else {
      visits = await db
        .collection('activity_log')
        .where('created_time', '>=', from)
        .where('created_time', '<=', to)
        .where('type', '==', logType)
        .get();
    }

    if (visits && !visits.empty) {
      visits.forEach((visit) => {
        const v = {
          id: visit.id,
          ...visit.data(),
        };
        v.created_time = v.created_time.toDate();
        retData.push(v);
      });
    }

    res.status(httpStatus.OK).json(retData);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.toString());
  }
};

module.exports = {
  listActivityLog,
};
