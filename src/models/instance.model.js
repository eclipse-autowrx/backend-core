// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const InstanceRelation = require('./instanceRelation.model');

const instanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Reference to the Schema this instance conforms to
    schema: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schema',
      required: true,
      index: true, // Important for querying instances of a specific schema
    },
    // The actual data/object payload
    data: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
instanceSchema.plugin(toJSON);
instanceSchema.plugin(paginate);

instanceSchema.post('remove', async function (_, next) {
  try {
    const instanceRelations = await InstanceRelation.find({
      $or: [{ source: this._id }, { target: this._id }],
    });
    await Promise.all(instanceRelations.map((ir) => ir.remove()));
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef Instance
 */
const Instance = mongoose.model('Instance', instanceSchema);

module.exports = Instance;
