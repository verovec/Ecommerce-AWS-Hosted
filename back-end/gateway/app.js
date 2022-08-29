const dotenv = require('dotenv')

dotenv.config()

const cors = require('cors')
const express = require('express')
const { json, urlencoded } = require('express')
const logger = require('./utils/logger')
const { gateway } = require('./config')
const rabbitmq = require('./utils/rabbitmq')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/healthcheck', (req, res) => {
  res.send()
})

rabbitmq.connect().then(async () => {
  app.listen({ port: gateway.port }, async () => {
    logger.info('Initializing gateway routing...')
    routes.initService('user').then((routes) => {
      app.use('/', routes)
    })
    routes.initService('product').then((routes) => {
      app.use('/', routes)
    })
    logger.info(`Gateway listening on port ${gateway.port}`)
  })
})
