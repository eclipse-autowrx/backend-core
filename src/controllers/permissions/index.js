const { MODEL } = require('./MODEL');
const { PROTOTYPE } = require('./PROTOTYPE');
const { TENANT } = require('./TENANT');

const { TENANT_ID } = process.env;

module.exports = {
  TENANT_ID,
  MODEL,
  TENANT,
  PROTOTYPE,
};
