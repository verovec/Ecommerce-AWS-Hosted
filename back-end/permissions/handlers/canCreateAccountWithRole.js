const { canCreateAccountWithRole } = require('../utils/permissions')

const canCreateAccountWithRoleHandler = ({ user, role } = {}) =>
  canCreateAccountWithRole(user, role)

module.exports = {
  handler: canCreateAccountWithRoleHandler,
  queue: 'permissions:canCreateAccountWithRole',
}
