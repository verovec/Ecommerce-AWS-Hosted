const router = require('express').Router()

const rabbitmq = require('../utils/rabbitmq')
const logger = require('../utils/logger')
const { getAuth } = require('../utils/common')

module.exports.initService = async (serviceName) => {
  logger.info(`Initializing ${serviceName} service routes...`)
  const getRoutes = async () => {
    const routes = await rabbitmq.publish(`${serviceName}:routes`)

    if (routes && routes.error && routes.error.code === 'SERVICE_TIMEOUT') {
      logger.warn(`${serviceName} service timeout, retrying...`)
      return getRoutes()
    }

    return routes
  }

  const routes = await getRoutes()

  routes.forEach((route) => {
    const { method, path } = route
    logger.info(`${serviceName} Service - [${method}] ${path} is available`)

    router[method](path, async (req, res) => {
      const { status, ...response } = await rabbitmq.publish(
        `${method}:${path}`,
        {
          body: req.body,
          params: req.params,
          query: req.query,
          user: await getAuth(req.headers),
        }
      )

      res.status(status).json(response)
    })
  })

  return router
}
