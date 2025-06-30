// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Relation = require('./relation.model');
const Instance = require('./instance.model');

const schemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    schema_definition: {
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

schemaSchema.plugin(toJSON);
schemaSchema.plugin(paginate);

schemaSchema.post('remove', async function (_, next) {
  try {
    const relations = await Relation.find({
      $or: [{ source: this._id }, { target: this._id }],
    });
    await Promise.all(relations.map((r) => r.remove()));
    const instances = await Instance.find({ schema: this._id });
    await Promise.all(instances.map((i) => i.remove()));
    next();
  } catch (error) {
    next(error);
  }
});

const SchemaModel = mongoose.model('Schema', schemaSchema);

module.exports = SchemaModel;
