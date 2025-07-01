// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const { Relation, Schema } = require('../models');
const ApiError = require('../utils/ApiError');
const ParsedJsonPropertiesMongooseDecorator = require('../decorators/ParsedJsonPropertiesMongooseDecorator');
const { buildMongoSearchFilter } = require('../utils/queryUtils');

/**
 * Check if source and target schemas exist
 * @param {ObjectId} sourceId
 * @param {ObjectId} targetId
 */
const checkSchemasExist = async (sourceId, targetId) => {
  const sourceSchema = await Schema.findById(sourceId);
  if (!sourceSchema) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Source schema with id ${sourceId} not found`);
  }
  if (sourceId.toString() !== targetId.toString()) {
    const targetSchema = await Schema.findById(targetId);
    if (!targetSchema) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Target schema with id ${targetId} not found`);
    }
  } // Allow self-referencing relations
};

/**
 * Create a relation
 * @param {Object} relationBody
 * @param {string} userId
 * @returns {Promise<Relation>}
 */
const createRelation = async (relationBody, userId) => {
  await checkSchemasExist(relationBody.source, relationBody.target);

  // Check uniqueness (the compound index handles DB level check, but good to check here too)
  const existingRelation = await Relation.findOne({
    source: relationBody.source,
    target: relationBody.target,
    type: relationBody.type,
  });
  if (existingRelation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Relation of this type between these schemas already exists');
  }

  const relation = await Relation.create({
    ...relationBody,
    created_by: userId,
  });
  return relation;
};

/**
 * Query for relations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} [advanced] - Advanced options: eg. search
 * @returns {Promise<QueryResult>}
 */
const queryRelations = async (filter, options, advanced) => {
  // Ensure relations are populated with schema names for context
  if (!options.populate) {
    // Need wrapping array because of spread operator in paginate.plugin logic
    options.populate = [
      [
        {
          path: 'source',
          select: 'name',
        },
        {
          path: 'target',
          select: 'name',
        },
        {
          path: 'created_by',
          select: 'name image_file',
        },
      ],
    ];
  }
  const finalFilter = buildMongoSearchFilter(filter, advanced.search, ['type', 'description', 'cardinality']);
  const relations = await Relation.paginate(finalFilter, options);
  return relations;
};

/**
 * Get relation by id
 * @param {ObjectId} id
 * @returns {Promise<Relation>}
 */
const getRelationById = async (id) => {
  const relation = await Relation.findById(id)
    .populate('source')
    .populate('target')
    .populate('created_by', 'name image_file');
  if (!relation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Relation not found');
  }
  return new ParsedJsonPropertiesMongooseDecorator(
    relation,
    'source.schema_definition',
    'target.schema_definition'
  ).getParsedPropertiesData();
};

/**
 *
 * @param {string} relationId
 * @param {string} userId
 */
const isOwner = async (relationId, userId) => {
  const relation = await getRelationById(relationId);
  return String(relation.created_by?._id) === String(userId);
};

/**
 * Update relation by id
 * @param {ObjectId} relationId
 * @param {Object} updateBody
 * @returns {Promise<Relation>}
 */
const updateRelationById = async (relationId, updateBody) => {
  const relation = await getRelationById(relationId);

  // Prevent changing source/target easily, or re-validate if allowed
  if (updateBody.source || updateBody.target || updateBody.type) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Updating source, target, or type is not recommended. Delete and recreate if needed.'
    );
  }

  Object.assign(relation, updateBody);
  await relation.save();
  return relation;
};

/**
 * Delete relation by id
 * @param {ObjectId} relationId
 * @returns {Promise<Relation>}
 */
const deleteRelationById = async (relationId) => {
  const relation = await getRelationById(relationId);
  await relation.remove();
  return relation;
};

module.exports.createRelation = createRelation;
module.exports.queryRelations = queryRelations;
module.exports.getRelationById = getRelationById;
module.exports.updateRelationById = updateRelationById;
module.exports.deleteRelationById = deleteRelationById;
module.exports.isOwner = isOwner;
