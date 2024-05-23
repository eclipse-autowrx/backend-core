const { slugify } = require('../utils/textProcessing');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }

  return value;
};

const jsonString = (value, helpers) => {
  try {
    JSON.parse(value);
    return value;
  } catch (error) {
    return helpers.message('{{#label}} is invalid JSON string');
  }
};

const slug = (value, helpers) => {
  if (slugify(value) !== value) {
    return helpers.message('{{#label}} must be a slug-like string');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  jsonString,
  slug,
};
