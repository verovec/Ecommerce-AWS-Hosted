const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

class UserCartHasProducts extends Model {}

UserCartHasProducts.init(
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

const deleteById = async (cartId, productId) =>
  UserCartHasProducts.destroy({
    where: { userCartId: cartId, productId },
  })

const deleteAll = async (cartId) =>
  UserCartHasProducts.destroy({ where: { userCartId: cartId } })

module.exports = {
  Model: UserCartHasProducts,
  deleteById,
  deleteAll,
}
