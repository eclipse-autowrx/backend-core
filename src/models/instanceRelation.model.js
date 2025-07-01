// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const instanceRelationSchema = new mongoose.Schema(
  {
    // Reference to the Relation definition that describes this link type
    relation: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Relation',
      required: true,
      index: true,
    },
    // The instance where the relation originates
    source: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Instance',
      required: true,
      index: true, // Crucial for graph traversals
    },
    // The instance the relation points to
    target: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Instance',
      required: true,
      index: true, // Crucial for graph traversals
    },
    // Optional: Metadata specific to this individual relationship instance
    // (e.g., relationship strength, status, timestamps specific to the link)
    metadata: {
      type: mongoose.SchemaTypes.Mixed,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt indicates when the link was established
  }
);

// Add index for common traversal patterns
instanceRelationSchema.index({ source: 1, target: 1, relation: 1 }, { unique: true });
instanceRelationSchema.index({ source: 1, relation: 1 });
instanceRelationSchema.index({ target: 1, relation: 1 });

// Add plugins
instanceRelationSchema.plugin(toJSON);
instanceRelationSchema.plugin(paginate); // Paginate might be less common here

/**
 * @typedef InstanceRelation
 */
const InstanceRelation = mongoose.model('InstanceRelation', instanceRelationSchema);

module.exports = InstanceRelation;
