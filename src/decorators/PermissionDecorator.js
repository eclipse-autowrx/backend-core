const { PERMISSIONS_DESCRIPTION } = require('../config/roles');

class PermissionDecorator {
  constructor(permission) {
    this.permission = permission;
  }

  getPermission() {
    return {
      name: this.permission,
      description: PERMISSIONS_DESCRIPTION[this.permission],
    };
  }
}

module.exports = PermissionDecorator;
