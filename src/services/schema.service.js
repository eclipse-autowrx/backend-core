// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const { Schema } = require('../models');
const ApiError = require('../utils/ApiError');
const Ajv = require('ajv');
const ParsedJsonPropertiesMongooseDecorator = require('../decorators/ParsedJsonPropertiesMongooseDecorator');
const ParsedJsonPropertiesMongooseListDecorator = require('../decorators/ParsedJsonPropertiesMongooseListDecorator');
const { buildMongoSearchFilter } = require('../utils/queryUtils');
const ajv = new Ajv();

/**
 *
 * @param {string} schemaDefinition
 */
const validateSchemaDefinition = async (schemaDefinition) => {
  try {
    const schema = JSON.parse(schemaDefinition);
    const validate = ajv.compile(schema);
    validate(schema);
  } catch (error) {
    if (error instanceof Ajv.ValidationError) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Schema validation error: ${error.message}`);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, `Schema validation error: ${error.message}`);
  }
};

/**
 * Create a schema
 * @param {Object} schemaBody
 * @param {string} userId
 * @returns {Promise<Schema>}
 */
const createSchema = async (schemaBody, userId) => {
  await validateSchemaDefinition(schemaBody.schema_definition);

  const schema = await Schema.create({
    ...schemaBody,
    created_by: userId,
  });
  return schema;
};

/**
 * Query for schemas
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} [advanced] - Advanced options: eg. search
 * @returns {Promise<QueryResult>}
 */
const querySchemas = async (filter, options, advanced) => {
  const finalFilter = buildMongoSearchFilter(filter, advanced.search, ['name', 'description']);
  const schemas = await Schema.paginate(finalFilter, options);
  schemas.results = new ParsedJsonPropertiesMongooseListDecorator(
    schemas.results,
    'schema_definition'
  ).getParsedPropertiesDataList();
  return schemas;
};

/**
 * Get schema by id
 * @param {ObjectId} id
 * @returns {Promise<Schema>}
 */
const getSchemaById = async (id) => {
  const schema = await Schema.findById(id).populate('created_by');
  if (!schema) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schema not found');
  }
  return new ParsedJsonPropertiesMongooseDecorator(schema, 'schema_definition').getParsedPropertiesData();
};

/**
 *
 * @param {string} schemaId
 * @param {string} userId
 */
const isOwner = async (schemaId, userId) => {
  const schema = await getSchemaById(schemaId);
  return String(schema.created_by?._id) === String(userId);
};

/**
 * Update schema by id
 * @param {ObjectId} schemaId
 * @param {Object} updateBody
 * @returns {Promise<Schema>}
 */
const updateSchemaById = async (schemaId, updateBody) => {
  const schema = await getSchemaById(schemaId); // Reuse getById to check existence
  if (updateBody.schema_definition) {
    await validateSchemaDefinition(updateBody.schema_definition);
  }
  Object.assign(schema, updateBody);
  await schema.save();
  return schema;
};

/**
 * Delete schema by id
 * @param {ObjectId} schemaId
 * @returns {Promise<Schema>}
 */
const deleteSchemaById = async (schemaId) => {
  const schema = await getSchemaById(schemaId);
  await schema.remove();
  return schema;
};

module.exports.createSchema = createSchema;
module.exports.querySchemas = querySchemas;
module.exports.getSchemaById = getSchemaById;
module.exports.isOwner = isOwner;
module.exports.updateSchemaById = updateSchemaById;
module.exports.deleteSchemaById = deleteSchemaById;
