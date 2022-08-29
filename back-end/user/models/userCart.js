const { Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const Product = require('./product')
const UserCartHasProducts = require('./userCartHasProducts')
const ProductTag = require('./productTag')
const ProductCategory = require('./productCategory')
const User = require('./user')

class UserCart extends Model {}

UserCart.init(
  {},
  {
    sequelize,
  }
)

const formatted = (cart) => {
  const { UserId, Products } = cart

  return {
    userId: UserId,
    products: (Products || []).map((product) => ({
      ...Product.formatted(product),
      cartQuantity: product.UserCartHasProducts.quantity,
    })),
  }
}

const findOneByUserId = async (
  userId,
  { offset = 0, limit = 10 } = {},
  { instance = false } = {}
) => {
  const cart = await UserCart.findOne({
    where: { userId },
  })

  if (instance) return cart

  const products = await cart.getProducts({
    offset,
    limit,
    include: [ProductTag.Model, ProductCategory.Model, User.Model],
    order: [['createdAt', 'DESC']],
  })

  return formatted({
    ...cart.toJSON(),
    Products: products.map((product) => product.toJSON()),
  })
}

const setProduct = async ({ user, product }, { quantity }) => {
  const cart = await user.getUserCart()

  await cart.addProduct(product, { through: { quantity } })

  return findOneByUserId(user.id)
}

const deleteProduct = async ({ user, product }) => {
  const cart = await user.getUserCart()

  await UserCartHasProducts.deleteById(cart.id, product.id)

  return findOneByUserId(user.id)
}

const deleteAllProducts = async ({ user }) => {
  const cart = await user.getUserCart()

  await UserCartHasProducts.deleteAll(cart.id)

  return findOneByUserId(user.id)
}

module.exports = {
  Model: UserCart,
  setProduct,
  deleteProduct,
  deleteAllProducts,
  findOneByUserId,
}
