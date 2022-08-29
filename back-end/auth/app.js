const dotenv = require('dotenv')

dotenv.config()

const http = require('http')
const logger = require('./utils/logger')
const { auth } = require('./config')
const rabbitmq = require('./utils/rabbitmq')
const handlers = require('./handlers')

const server = http.createServer((req, res) => {
  res.end()
})

rabbitmq.connect().then(async () => {
  server.listen({ port: auth.port }, async () => {
    logger.info('Initializing auth service handlers...')
    await handlers.init(server)
    logger.info(`Auth service listening on port ${auth.port}`)
  })
})
