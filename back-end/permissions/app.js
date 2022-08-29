const dotenv = require('dotenv')

dotenv.config()

const http = require('http')
const logger = require('./utils/logger')
const { permissions } = require('./config')
const rabbitmq = require('./utils/rabbitmq')
const handlers = require('./handlers')

const server = http.createServer((req, res) => {
  res.end()
})
rabbitmq.connect().then(async () => {
  server.listen({ port: permissions.port }, async () => {
    logger.info('Initializing permissions service handlers...')
    await handlers.init(server)
    logger.info(`Permissions service listening on port ${permissions.port}`)
  })
})
