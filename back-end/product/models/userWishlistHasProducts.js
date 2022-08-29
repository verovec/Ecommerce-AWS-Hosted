const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

class UserWishlistHasProducts extends Model {}

UserWishlistHasProducts.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
  }
)

const deleteById = async (wishlistId, productId) =>
  UserWishlistHasProducts.destroy({
    where: { userWishlistId: wishlistId, productId },
  })

const deleteAll = async (wishlistId) =>
  UserWishlistHasProducts.destroy({ where: { userWishlistId: wishlistId } })

module.exports = {
  Model: UserWishlistHasProducts,
  deleteById,
  deleteAll,
}
