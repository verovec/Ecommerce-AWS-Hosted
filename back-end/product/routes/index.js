const rabbitmq = require('../utils/rabbitmq')
const product = require('./product')
const rating = require('./rating')
const category = require('./category')

const handlers = [...product, ...rating, ...category]

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

  rabbitmq.subscribe('product:routes', async () => routes)
}
