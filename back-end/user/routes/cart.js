const {
  setProduct,
  deleteProduct,
  deleteAllProducts,
  findOneByUserId,
} = require('../handlers/cart')

module.exports = [setProduct, deleteProduct, deleteAllProducts, findOneByUserId]
