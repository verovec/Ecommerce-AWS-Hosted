const { isSeller } = require('../utils/permissions')

const isSellerHandler = ({ user } = {}) => isSeller(user)

module.exports = {
  handler: isSellerHandler,
  queue: 'permissions:isSeller',
}
