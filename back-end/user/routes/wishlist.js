const {
  setProduct,
  findOneByUserId,
  deleteAllProducts,
  deleteProduct,
} = require('../handlers/wishlist')

module.exports = [
  setProduct,
  findOneByUserId,
  deleteAllProducts,
  deleteProduct,
]
