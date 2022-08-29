const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

class ProductTag extends Model {}

ProductTag.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

module.exports = { Model: ProductTag }
