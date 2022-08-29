const { isAdmin } = require('../utils/permissions')

const isAdminHandler = ({ user } = {}) => isAdmin(user)

module.exports = {
  handler: isAdminHandler,
  queue: 'permissions:isAdmin',
}
