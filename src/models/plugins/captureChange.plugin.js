const _ = require('lodash');
const ChangeLog = require('../changeLog.model');
const logger = require('../../config/logger');

/**
 * Throttle logger class to enable logging changes in batches (eg. in case of bulk updates on frequently updated field like "code")
 */
class ThrottleLogger {
  constructor(throttleInterval = 60000) {
    this.throttleInterval = throttleInterval;
    /** @type {import('../changeLog.model').CodeChangeDocument} */
    this.data = null;
    this.timer = null;
    this.lastLoggedTime = 0;
  }

  async updateData(data) {
    this.data = _.merge({}, this.data, data);
    const timeSyncLastLog = Date.now() - this.lastLoggedTime;

    if (timeSyncLastLog >= this.throttleInterval) {
      await this._logDataUpdate();
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      const timeRemaining = this.throttleInterval - timeSyncLastLog;

      this.timer = setTimeout(async () => {
        await this._logDataUpdate();
      }, timeRemaining);
    }
  }

  async _logDataUpdate() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      await ChangeLog.create(this.data);
    } catch (error) {
      logger.error(`Error saving change log to database for ${this.data.ref_type} with id ${this.data.ref}`);
      logger.error(error);
    } finally {
      this.lastLoggedTime = Date.now();
    }

    this.data = null;
  }
}

const throttleLogger = new ThrottleLogger();

/**
 * @typedef {import('mongoose').Model} MongooseModel
 */

/**
 * Pre-save middleware to capture updates
 * @this {import('mongoose').Document}
 * @param {Function} next
 * @returns {Promise<void>}
 */
async function captureUpdates(next) {
  this.wasNew = this.isNew;
  /** @type {MongooseModel} */
  const thisConstructor = this.constructor;

  if (!this.isNew) {
    try {
      const original = await thisConstructor.findById(this._id).lean();
      if (original) {
        const changes = {};
        Object.keys(this._doc).forEach((field) => {
          if (
            field != '_id' &&
            field != '__v' &&
            field != 'updatedAt' &&
            field != 'createdAt' &&
            field != 'created_by' &&
            !_.isEqual(JSON.stringify(original[field]), JSON.stringify(this[field]))
          ) {
            changes[field] = {
              old: original[field],
              new: this[field],
            };
          }
        });
        if (!_.isEmpty(changes)) {
          const data = {
            created_by: this.action_owner,
            ref_type: thisConstructor.modelName,
            ref: this._id,
            action: 'UPDATE',
            changes,
          };
          await throttleLogger.updateData(data);
        }
      }
    } catch (error) {
      logger.error(`Error capturing updates for ${thisConstructor.modelName} with id ${this._id}`);
      logger.error(error);
    }
  }
  next();
}

/**
 * Post-save middleware to capture creation
 * @this {import('mongoose').Document}
 * @param {import('mongoose').Document} doc
 * @returns {Promise<void>}
 */
async function captureCreate(doc) {
  /** @type {MongooseModel} */
  const docConstructor = doc.constructor;
  try {
    if (this.wasNew) {
      await ChangeLog.create({
        created_by: doc.created_by,
        ref_type: docConstructor.modelName,
        ref: doc._id,
        action: 'CREATE',
        changes: doc.toObject(),
      });
    }
  } catch (error) {
    logger.error(`Error capturing create for ${doc.constructor.modelName} with id ${doc._id}`);
  }
}

/**
 * Post-remove middleware to capture creation
 * @this {import('mongoose').Document}
 * @param {import('mongoose').Document} doc
 * @returns {Promise<void>}
 */
async function captureRemove(doc) {
  try {
    await ChangeLog.create({
      created_by: doc.action_owner,
      ref_type: doc.constructor.modelName,
      ref: doc._id,
      action: 'DELETE',
      changes: doc.toObject(),
    });
  } catch (error) {
    logger.error(`Error capturing remove for ${doc.constructor.modelName} with id ${doc._id}`);
    logger.error(error);
  }
}

module.exports.captureUpdates = captureUpdates;
module.exports.captureCreate = captureCreate;
module.exports.captureRemove = captureRemove;
