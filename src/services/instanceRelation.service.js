// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const { InstanceRelation, Relation, Instance } = require('../models');
const ApiError = require('../utils/ApiError');
const ParsedJsonPropertiesMongooseDecorator = require('../decorators/ParsedJsonPropertiesMongooseDecorator');

/**
 * Validate the compatibility of source/target instances with the relation definition
 * @param {ObjectId} relationId
 * @param {ObjectId} sourceInstanceId
 * @param {ObjectId} targetInstanceId
 */
const validateRelationCompatibility = async (relationId, sourceInstanceId, targetInstanceId) => {
  const [relation, sourceInstance, targetInstance] = await Promise.all([
    Relation.findById(relationId).populate('source', 'name').populate('target', 'name'),
    Instance.findById(sourceInstanceId).populate('schema', 'name'),
    Instance.findById(targetInstanceId).populate('schema', 'name'),
  ]);

  if (!relation) throw new ApiError(httpStatus.BAD_REQUEST, `Relation with id ${relationId} not found.`);
  if (!sourceInstance) throw new ApiError(httpStatus.BAD_REQUEST, `Source instance with id ${sourceInstanceId} not found.`);
  if (!targetInstance) throw new ApiError(httpStatus.BAD_REQUEST, `Target instance with id ${targetInstanceId} not found.`);

  // Check if source instance's schema matches relation's source schema
  if (sourceInstance.schema._id.toString() !== relation.source._id.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Source instance's schema (${sourceInstance.schema}) does not match relation's defined source schema (${relation.source})`
    );
  }

  // Check if target instance's schema matches relation's target schema
  if (targetInstance.schema._id.toString() !== relation.target._id.toString()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Target instance's schema (${targetInstance.schema}) does not match relation's defined target schema (${relation.target})`
    );
  }

  return true;
};

/**
 * Create an instance relation
 * @param {Object} body
 * @param {string} userId
 * @returns {Promise<InstanceRelation>}
 */
const createInstanceRelation = async (body, userId) => {
  // 1. Validate compatibility
  await validateRelationCompatibility(body.relation, body.source, body.target);

  // Optional: Check for duplicates if the same relation between the same instances shouldn't exist twice
  const existing = await InstanceRelation.findOne({
    relation: body.relation,
    source: body.source,
    target: body.target,
  });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This exact relation between these instances already exists.');
  }

  // 2. Create the instance relation
  const instanceRelation = await InstanceRelation.create({
    ...body,
    created_by: userId,
  });
  return instanceRelation;
};

/**
 * Query for instance relations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryInstanceRelations = async (filter, options) => {
  // Populate fields for context
  if (!options.populate) {
    // Need wrapping array because of spread operator in paginate.plugin logic
    options.populate = [
      [
        { path: 'relation', select: 'type source target' },
        { path: 'source', select: 'schema' },
        { path: 'target', select: 'schema' },
        { path: 'created_by', select: 'name image_file' },
      ],
    ];
  }
  const instanceRelations = await InstanceRelation.paginate(filter, options);
  return instanceRelations;
};

/**
 * Get instance relation by id
 * @param {ObjectId} id
 * @returns {Promise<InstanceRelation>}
 */
const getInstanceRelationById = async (id) => {
  const instanceRelation = await InstanceRelation.findById(id).populate('relation').populate('source').populate('target');
  if (!instanceRelation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instance relation not found');
  }
  return new ParsedJsonPropertiesMongooseDecorator(instanceRelation, 'source.data', 'target.data').getParsedPropertiesData();
};

/**
 *
 * @param {string} instanceRelationId
 * @param {string} userId
 * @returns
 */
const isOwner = async (instanceRelationId, userId) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);
  return String(instanceRelation.created_by?._id) === String(userId);
};

/**
 * Update instance relation by id (typically only metadata)
 * @param {ObjectId} instanceRelationId
 * @param {Object} updateBody
 * @returns {Promise<InstanceRelation>}
 */
const updateInstanceRelationById = async (instanceRelationId, updateBody) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);

  Object.assign(instanceRelation, updateBody);
  await instanceRelation.save();
  return instanceRelation;
};

/**
 * Delete instance relation by id
 * @param {ObjectId} instanceRelationId
 * @returns {Promise<InstanceRelation>}
 */
const deleteInstanceRelationById = async (instanceRelationId) => {
  const instanceRelation = await getInstanceRelationById(instanceRelationId);
  await instanceRelation.remove();
  return instanceRelation;
};

module.exports.createInstanceRelation = createInstanceRelation;
module.exports.queryInstanceRelations = queryInstanceRelations;
module.exports.getInstanceRelationById = getInstanceRelationById;
module.exports.updateInstanceRelationById = updateInstanceRelationById;
module.exports.deleteInstanceRelationById = deleteInstanceRelationById;
module.exports.isOwner = isOwner;
