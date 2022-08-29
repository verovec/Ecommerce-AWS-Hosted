const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const Product = require('./product')
const UserAddress = require('./userAddress')
const User = require('./user')
const UserCart = require('./userCart')
const OrderHasProducts = require('./orderHasProducts')

class Order extends Model {}

const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
}

Order.init(
  {
    status: {
      type: DataTypes.ENUM(STATUS.PENDING, STATUS.FULFILLED),
      defaultValue: STATUS.PENDING,
    },
  },
  {
    sequelize,
  }
)

const formatted = (order) => {
  const {
    UserId,
    Products,
    UserAddressId,
    UserAddress: userAddress,
    User: user,
    ...formattedOrder
  } = order

  return {
    ...formattedOrder,
    userId: UserId,
    userAddressId: UserAddressId,
    products: (Products || []).map((product) => ({
      ...Product.formatted(product),
      orderQuantity: product.OrderHasProducts.quantity,
      orderStatus: product.OrderHasProducts.status,
    })),
    address: userAddress ? UserAddress.formatted(userAddress) : null,
    user: user ? User.formatted(user, { email: true }) : null,
  }
}

const findOneById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [Product.Model, UserAddress.Model, User.Model],
  })

  if (!order) return null

  return formatted(order.toJSON())
}

const create = async ({ user, address, cart }) => {
  const order = await Order.create()
  await order.setUser(user)
  await order.setUserAddress(address)

  const products = await cart.getProducts()

  await Promise.all(
    products.map(async (product) => {
      const { quantity } = product.UserCartHasProducts
      await order.addProduct(product, {
        through: { quantity },
      })
      await Product.Model.update(
        {
          quantity: product.quantity - quantity,
        },
        { where: { id: product.id } }
      )
    })
  )

  await UserCart.deleteAllProducts({ user })

  return findOneById(order.id)
}

const findAllBySellerId = async (userId, { limit, offset }) => {
  const orders = await Order.findAll({
    offset,
    limit,
    include: [
      {
        model: Product.Model,
        where: {
          userId,
        },
      },
      UserAddress.Model,
      User.Model,
    ],
    order: [['createdAt', 'DESC']],
  })

  return orders.map((order) => formatted(order.toJSON()))
}

const findAllByUserId = async (userId, { limit, offset }) => {
  const orders = await Order.findAll({
    where: { userId },
    offset,
    limit,
    include: [Product.Model, UserAddress.Model, User.Model],
    order: [['createdAt', 'DESC']],
  })

  return orders.map((order) => formatted(order.toJSON()))
}

const findAllByProductId = async (productId, { limit, offset }) => {
  const orders = await Order.findAll({
    offset,
    limit,
    include: [
      UserAddress.Model,
      User.Model,
      {
        model: Product.Model,
        where: {
          id: productId,
        },
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  return orders.map((order) => {
    const { Products, ...jsonOrder } = order.toJSON()
    const product = Products[0]

    return {
      ...formatted(jsonOrder),
      productOrderQuantity: product && product.OrderHasProducts.quantity,
      productOrderStatus: product && product.OrderHasProducts.status,
    }
  })
}

const findOneByProductId = async (orderId, productId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Product.Model,
        where: {
          id: productId,
        },
      },
    ],
  })

  if (!order) return null

  const product = order.Products[0]

  return {
    ...formatted(order.toJSON()),
    productOrderStatus: product && product.OrderHasProducts.status,
  }
}

const dispatchByProductId = async (orderId, productId) => {
  await OrderHasProducts.Model.update(
    {
      status: 'DISPATCHED',
    },
    {
      where: {
        orderId,
        productId,
      },
    }
  )

  const orderProducts = await OrderHasProducts.Model.findAll({
    where: { orderId },
  })

  const orderIsFulfilled = orderProducts.every(
    (orderProduct) => orderProduct.status === 'DISPATCHED'
  )

  if (orderIsFulfilled) {
    await Order.update(
      {
        status: 'FULFILLED',
      },
      {
        where: {
          id: orderId,
        },
      }
    )
  }

  return findOneByProductId(orderId, productId)
}

module.exports = {
  Model: Order,
  create,
  findOneById,
  findAllByUserId,
  findOneByProductId,
  findAllByProductId,
  findAllBySellerId,
  STATUS,
  dispatchByProductId,
}
