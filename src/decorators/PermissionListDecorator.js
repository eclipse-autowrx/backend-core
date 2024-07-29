const PermissionDecorator = require('./PermissionDecorator');

class PermissionListDecorator {
  constructor(permissions) {
    this.permissions = permissions;
  }

  getPermissionList() {
    return this.permissions.map((permission) => new PermissionDecorator(permission).getPermission());
  }
}

module.exports = PermissionListDecorator;
