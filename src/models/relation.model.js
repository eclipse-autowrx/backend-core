// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

// models/relation.model.js
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const InstanceRelation = require('./instanceRelation.model');

const relationSchema = new mongoose.Schema(
  {
    // Common types are: composition, association, inheritance. Default to be 'custom'
    type: {
      type: String,
      trim: true,
      required: true,
      index: true,
      default: 'custom',
    },
    description: {
      type: String,
      trim: true,
    },
    // The schema where the relation originates
    source: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schema',
      required: true,
      index: true,
    },
    // The schema the relation points to
    target: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schema',
      required: true,
      index: true,
    },
    // Optional: Cardinality of relation
    cardinality: {
      type: String,
      trim: true,
      enum: ['one-to-one', 'one-to-many', 'many-to-many'],
    },
    // Optional: Store constraints or properties about the relation type
    properties: {
      type: mongoose.SchemaTypes.Mixed,
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

// Add index for common lookups & unique
relationSchema.index({ source: 1, target: 1, type: 1 }, { unique: true });

// Add plugins
relationSchema.plugin(toJSON);
relationSchema.plugin(paginate);

relationSchema.post('remove', async function (_, next) {
  try {
    const instanceRelations = await InstanceRelation.find({
      relation: this._id,
    });
    await Promise.all(instanceRelations.map((ir) => ir.remove()));
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef Relation
 */
const Relation = mongoose.model('Relation', relationSchema);

module.exports = Relation;
