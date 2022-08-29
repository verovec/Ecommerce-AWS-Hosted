const { canManageUser } = require('../utils/permissions')

const canManageUserHandler = ({ user, userId } = {}) =>
  canManageUser(user, userId)

module.exports = {
  handler: canManageUserHandler,
  queue: 'permissions:canManageUser',
}
