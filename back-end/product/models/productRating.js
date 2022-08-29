const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const User = require('./user')

class ProductRating extends Model {}

ProductRating.init(
  {
    count: {
      type: DataTypes.DOUBLE,
      defaultValue: 1,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
  }
)

const formatted = (rating) => {
  const { UserId, ProductId, User: ratingUser, ...formattedRating } = rating

  return {
    ...formattedRating,
    userId: UserId,
    productId: ProductId,
    user: ratingUser ? User.formatted(ratingUser) : undefined,
  }
}

const findOneById = async (ratingId) => {
  const rating = await ProductRating.findByPk(ratingId, {
    include: [User.Model],
  })

  if (!rating) return null

  return formatted(rating.toJSON())
}

const create = async ({ product, user }, { count, message }) => {
  const rating = await ProductRating.create({
    count,
    message,
  })

  await product.addProductRating(rating)
  await user.addProductRating(rating)

  return findOneById(rating.id)
}

const findAllByProductId = async (productId, { limit, offset }) => {
  const ratings = await ProductRating.findAll({
    where: { productId },
    include: [User.Model],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  })

  return ratings.map((rating) => formatted(rating.toJSON()))
}

const findOneByUserAndProductId = async (productId, userId) =>
  ProductRating.findOne({ where: { productId, userId } })

module.exports = {
  Model: ProductRating,
  create,
  findAllByProductId,
  findOneByUserAndProductId,
}
