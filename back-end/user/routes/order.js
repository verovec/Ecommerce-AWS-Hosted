const {
  create,
  findOneById,
  findAllByUserId,
  findAllByProductId,
  dispatch,
  findAllBySellerId,
} = require('../handlers/order')

module.exports = [
  create,
  findOneById,
  findAllByUserId,
  findAllByProductId,
  dispatch,
  findAllBySellerId,
]
