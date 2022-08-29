const Product = require('./product')
const ProductCategory = require('./productCategory')
const ProductRating = require('./productRating')
const ProductTag = require('./productTag')

const User = require('./user')
const UserAddress = require('./userAddress')
const UserCart = require('./userCart')
const UserCartHasProducts = require('./userCartHasProducts')
const UserWishlistHasProducts = require('./userWishlistHasProducts')
const UserRole = require('./userRole')
const UserWishlist = require('./userWishlist')

const Order = require('./order')
const OrderHasProducts = require('./orderHasProducts')

User.Model.belongsToMany(UserRole.Model, { through: 'UserHasRoles' })
User.Model.hasOne(UserWishlist.Model)
User.Model.hasMany(UserAddress.Model)
User.Model.hasMany(ProductRating.Model)
User.Model.hasMany(Product.Model)
User.Model.hasOne(UserCart.Model)

UserWishlist.Model.belongsToMany(Product.Model, {
  through: 'UserWishlistHasProducts',
})

Product.Model.hasMany(ProductTag.Model)
Product.Model.belongsToMany(ProductCategory.Model, {
  through: 'ProductHasCategories',
})
Product.Model.belongsTo(User.Model)
Product.Model.hasMany(ProductRating.Model)
ProductRating.Model.belongsTo(User.Model)

UserCart.Model.belongsToMany(Product.Model, { through: 'UserCartHasProducts' })

Order.Model.belongsTo(User.Model)
Order.Model.belongsTo(UserAddress.Model)
Order.Model.belongsToMany(Product.Model, { through: 'OrderHasProducts' })

module.exports = {
  ProductRating,
  Product,
  ProductCategory,
  ProductTag,

  Order,
  OrderHasProducts,

  UserCart,
  User,
  UserAddress,
  UserCartHasProducts,
  UserRole,
  UserWishlist,
  UserWishlistHasProducts,
}
