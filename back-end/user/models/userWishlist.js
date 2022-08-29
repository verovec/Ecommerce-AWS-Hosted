const { Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const ProductTag = require('./productTag')
const ProductCategory = require('./productCategory')
const User = require('./user')
const Product = require('./product')
const UserWishlistHasProducts = require('./userWishlistHasProducts')

class UserWishlist extends Model {}

UserWishlist.init(
  {},
  {
    sequelize,
  }
)

const formatted = (wishlist) => {
  const { UserId, Products } = wishlist

  return {
    userId: UserId,
    products: (Products || []).map((product) => ({
      ...Product.formatted(product),
      wishlistQuantity: product.UserWishlistHasProducts.quantity,
    })),
  }
}

const findOneByUserId = async (
  userId,
  { offset = 0, limit = 10 } = {},
  { instance = false } = {}
) => {
  const wishlist = await UserWishlist.findOne({
    where: { userId },
  })

  if (instance) return wishlist

  const products = await wishlist.getProducts({
    offset,
    limit,
    include: [ProductTag.Model, ProductCategory.Model, User.Model],
    order: [['createdAt', 'DESC']],
  })

  return formatted({
    ...wishlist.toJSON(),
    Products: products.map((product) => product.toJSON()),
  })
}

const setProduct = async ({ user, product }, { quantity }) => {
  const wishlist = await user.getUserWishlist()

  await wishlist.addProduct(product, { through: { quantity } })

  return findOneByUserId(user.id)
}

const deleteAllProducts = async ({ user }) => {
  const wishlist = await user.getUserWishlist()

  await UserWishlistHasProducts.deleteAll(wishlist.id)

  return findOneByUserId(user.id)
}

const deleteProduct = async ({ user, product }) => {
  const wishlist = await user.getUserWishlist()

  await UserWishlistHasProducts.deleteById(wishlist.id, product.id)

  return findOneByUserId(user.id)
}

module.exports = {
  Model: UserWishlist,
  setProduct,
  findOneByUserId,
  deleteAllProducts,
  deleteProduct,
}
