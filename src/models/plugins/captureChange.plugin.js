const _ = require('lodash');
const ChangeLog = require('../changeLog.model');

async function captureUpdates(next) {
  if (!this.isNew) {
    try {
      const original = this.constructor.findById(this._id).lean();
      if (original) {
        const changes = {};
        Object.keys(this._doc).forEach((field) => {
          if (field != '_id' && field != '__v' && !_.isEqual(original[field], this[field])) {
            changes[field] = {
              old: original[field],
              new: this[field],
            };
          }
        });
        if (!_.isEmpty(changes)) {
          await ChangeLog.create({
            created_by: this.action_owner,
            refType: this.constructor.modelName,
            ref: this._id,
            action: 'UPDATE',
            changes,
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
}

async function captureCreate(doc) {
  if (doc.isNew) {
    await ChangeLog.create({
      created_by: doc.created_by,
      refType: doc.constructor.modelName,
      ref: doc._id,
      action: 'CREATE',
      changes: doc.toObject(),
    });
  }
}

async function captureRemove(doc) {
  await ChangeLog.create({
    created_by: doc.action_owner,
    refType: doc.constructor.modelName,
    ref: doc._id,
    action: 'DELETE',
    changes: doc.toObject(),
  });
}

module.exports.captureUpdates = captureUpdates;
module.exports.captureCreate = captureCreate;
module.exports.captureRemove = captureRemove;
