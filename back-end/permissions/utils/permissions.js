const rabbitmq = require('./rabbitmq')

const ROLES = {
  SELLER: 'SELLER',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
}

const isAdmin = (user) =>
  user && user.roles && user.roles.some(({ name }) => name === ROLES.ADMIN)

const isSeller = (user) =>
  user && user.roles && user.roles.some(({ name }) => name === ROLES.SELLER)

const canCreateAccountWithRole = async (user, role) => {
  if (role === ROLES.BUYER) return true
  if (!user) return false

  if (!user.roles)
    user = await rabbitmq.publish('user:findUserById', { id: user.id })

  if (!user) return false

  return isAdmin(user)
}

const canManageUser = async (user, userId) => {
  if (!user) return false

  if (userId === user.id) return true

  if (!user.roles)
    user = await rabbitmq.publish('user:findUserById', { id: user.id })

  if (!user) return false

  return isAdmin(user)
}

module.exports = {
  canCreateAccountWithRole,
  canManageUser,
  isAdmin,
  isSeller,
}
