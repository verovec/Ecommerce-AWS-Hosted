const { Sequelize } = require('sequelize')
const { mysql } = require('../config')
const logger = require('./logger')

const sequelize = new Sequelize(mysql.uri, {
  logging: logger.debug.bind(logger),
})

module.exports.connect = sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' })
    logger.info('Mysql Connection has been established successfully.')
  })
  .catch((err) => {
    logger.error('Unable to connect to the database: ', { err })
    throw err
  })

module.exports.sequelize = sequelize
