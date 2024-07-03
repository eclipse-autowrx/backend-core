/* eslint-disable no-await-in-loop */
const { ROLES } = require('../config/roles');
const Role = require('../models/role.model');
const logger = require('../config/logger');

const initializeRoles = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax

    for (let i = 0; i < Object.keys(ROLES).length; i += 1) {
      const role = Object.keys(ROLES)[i];
      const roleExist = await Role.findOne({
        name: role,
      });
      if (!roleExist) {
        await Role.create({
          name: role,
          permissions: ROLES[role].permissions,
        });
      } else {
        await roleExist.updateOne({
          permissions: ROLES[role].permissions,
        });
      }
    }
    logger.info('Role initialization completed.');
  } catch (error) {
    logger.error(`Error initializing roles: ${error}`);
  }
};

module.exports = initializeRoles;
