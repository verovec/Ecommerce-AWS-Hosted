const rabbitmq = require('./rabbitmq')

const isAdmin = async (user) =>
  rabbitmq.publish('permissions:isAdmin', { user })

const isSeller = async (user) =>
  rabbitmq.publish('permissions:isSeller', { user })

const canCreateAccountWithRole = async (user, role) =>
  rabbitmq.publish('permissions:canCreateAccountWithRole', { user, role })

const canManageUser = async (user, userId) =>
  rabbitmq.publish('permissions:canManageUser', { user, userId })

module.exports = {
  canCreateAccountWithRole,
  canManageUser,
  isAdmin,
  isSeller,
}
