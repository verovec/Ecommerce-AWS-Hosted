const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

class OrderHasProducts extends Model {}

const STATUS = {
  PENDING: 'PENDING',
  DISPATCHED: 'DISPATCHED',
}

OrderHasProducts.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.DISPATCHED),
      defaultValue: STATUS.PENDING,
    },
  },
  {
    sequelize,
  }
)

module.exports = { Model: OrderHasProducts, STATUS }
