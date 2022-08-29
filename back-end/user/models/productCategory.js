const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

class ProductCategory extends Model {}

ProductCategory.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'column',
    },
  },
  {
    sequelize,
  }
)

const formatted = (category) => {
  const { id, name } = category

  return { id, name }
}

const findByIds = async (ids, { instance = false }) => {
  const categories = await ProductCategory.findAll({ where: { id: ids } })

  if (instance) return categories

  return categories.map((category) => formatted(category.toJSON()))
}

const findAll = async () => {
  const categories = await ProductCategory.findAll()

  return categories.map((category) => formatted(category.toJSON()))
}

module.exports = { Model: ProductCategory, findByIds, formatted, findAll }
