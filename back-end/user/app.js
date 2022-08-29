const dotenv = require('dotenv')

dotenv.config()
const http = require('http')
const { api } = require('./config')
const routes = require('./routes')
const logger = require('./utils/logger')
const mysql = require('./utils/mysql')

const server = http.createServer((req, res) => {
  res.end()
})

require('./utils/rabbitmq')
  .connect()
  .then(() => {
    mysql.connect
      .then(() => {
        server.listen({ port: api.port }, () => {
          routes()
          logger.info(`User service listening on port ${api.port}`)
        })
      })
      .catch(() => {})
  })
