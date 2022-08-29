const { DataTypes, Model, Op, Sequelize } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const ProductTag = require('./productTag')
const ProductCategory = require('./productCategory')
const User = require('./user')
const ProductRating = require('./productRating')
const elasticsearch = require('../utils/elasticsearch')

class Product extends Model {}

const STATES = {
  NEW: 'NEW',
  OCCASION: 'OCCASION',
  RECONDITIONED: 'RECONDITIONED',
}

Product.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM(Object.values(STATES)),
      allowNull: false,
      defaultValue: 'NEW',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    forSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

const formatted = (product) => {
  const {
    UserId,
    ProductTags,
    User: productUser,
    ProductCategories,
    UserCartHasProducts,
    OrderHasProducts,
    UserWishlistHasProducts,
    ...formattedProduct
  } = product

  return {
    ...formattedProduct,
    userId: UserId,
    user: productUser ? User.formatted(productUser) : undefined,
    tags: (ProductTags || []).map(({ name, id }) => ({ id, name })),
    categories: (ProductCategories || []).map((category) =>
      ProductCategory.formatted(category)
    ),
  }
}

const getProductsRatingAverage = async (productIds) => {
  const ratingsAverage = await Product.findAll({
    where: { id: productIds },
    attributes: [
      'id',
      [
        Sequelize.fn('AVG', Sequelize.col('ProductRatings.count')),
        'ratingAverage',
      ],
    ],
    include: [{ model: ProductRating.Model, attributes: [] }],
    group: ['id'],
  })

  return ratingsAverage.reduce((acc, curr) => {
    const data = curr.toJSON()

    return {
      ...acc,
      [data.id]: {
        ratingAverage: data.ratingAverage
          ? Math.round(data.ratingAverage * 2) / 2
          : null,
      },
    }
  }, {})
}

const findOneById = async (
  productId,
  { includeUser = false, instance = false } = {}
) => {
  const includes = [ProductTag.Model, ProductCategory.Model]
  if (includeUser) includes.push(User.Model)

  const product = await Product.findByPk(productId, {
    include: includes,
  })

  if (!product) return null

  const ratingAverage = await getProductsRatingAverage([productId])

  if (instance) return product

  return formatted({ ...product.toJSON(), ...ratingAverage[product.id] })
}

const create = async (
  { user, tags = [], categories = [] },
  { name, state, price, description, quantity, forSale, mark }
) => {
  const product = await Product.create({
    name,
    state,
    price,
    description,
    quantity,
    forSale,
    mark,
  })

  await elasticsearch.index({
    document: product.toJSON(),
  })

  await Promise.all(tags.map(({ name }) => product.createProductTag({ name })))

  await user.addProduct(product)
  await product.addProductCategories(categories)

  return findOneById(product.id)
}

const deleteById = async (productId) =>
  Product.destroy({ where: { id: productId } })

const update = async (
  productId,
  { tags = [], categories = [] },
  { name, state, price, description, quantity, forSale, mark }
) => {
  const product = await findOneById(productId, { instance: true })

  await Product.update(
    {
      name,
      state,
      price,
      description,
      quantity,
      forSale,
      mark,
    },
    { where: { id: productId } }
  )

  await product.setProductCategories([])
  await product.setProductTags([])
  await Promise.all(tags.map(({ name }) => product.createProductTag({ name })))

  await product.addProductCategories(categories)

  return findOneById(product.id)
}

const findAll = async (
  { limit, offset },
  { categoryIds, userIds, tagNames, states, fromPrice, toPrice, ids }
) => {
  const defaultQuery = {}
  const categoryQuery = {}
  const tagQuery = {}

  const addQueryOption = (query, field, method, value) => {
    // eslint-disable-next-line no-multi-assign
    query[field] = {
      ...(query[field] || {}),
      [method]: value,
    }
  }

  if (states) addQueryOption(defaultQuery, 'state', Op.or, states)
  if (userIds) addQueryOption(defaultQuery, 'userId', Op.or, userIds)
  if (fromPrice) addQueryOption(defaultQuery, 'price', Op.gte, fromPrice)
  if (toPrice) addQueryOption(defaultQuery, 'price', Op.lte, toPrice)
  if (categoryIds) addQueryOption(categoryQuery, 'id', Op.or, categoryIds)
  if (tagNames) addQueryOption(tagQuery, 'name', Op.or, tagNames)

  const products = await Product.findAll({
    where: {
      ...(ids && ids.length ? { id: ids } : {}),
      [Op.and]: {
        ...defaultQuery,
      },
      forSale: true,
    },
    include: [
      { model: ProductTag.Model, where: { ...tagQuery } },
      { model: ProductCategory.Model, where: { ...categoryQuery } },
      { model: User.Model },
    ],
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  })

  const averageRatings = await getProductsRatingAverage(
    products.map((product) => product.id)
  )

  return products.map((product) =>
    formatted({ ...product.toJSON(), ...averageRatings[product.id] })
  )
}

module.exports = {
  Model: Product,
  STATES,
  create,
  findOneById,
  deleteById,
  update,
  findAll,
  formatted,
}
