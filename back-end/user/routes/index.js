const rabbitmq = require('../utils/rabbitmq')

const auth = require('./auth')
const user = require('./user')
const address = require('./address')
const cart = require('./cart')
const order = require('./order')
const wishlist = require('./wishlist')
const { User } = require('../models')

const handlers = [...auth, ...user, ...address, ...cart, ...order, ...wishlist]

module.exports = () => {
  const routes = []

  handlers.forEach(({ method, path, middlewares, handler }, i) => {
    routes.push({ method, path })

    rabbitmq.subscribe(`${method}:${path}`, async (req) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const middleware of middlewares) {
        // eslint-disable-next-line no-await-in-loop
        const response = await middleware(req)

        if (!response.success) return response
      }

      return handler(req)
    })
  })

  rabbitmq.subscribe('user:findUserById', async (req) => {
    const { id } = req

    return User.findOneById(id, {
      fields: {
        email: true,
      },
    })
  })

  rabbitmq.subscribe('user:routes', async () => routes)
}
