const generateAuthToken = require('./generateAuthToken')
const getAuth = require('./getAuth')
const rabbitmq = require('../utils/rabbitmq')

const init = () => {
  const queues = []

  ;[generateAuthToken, getAuth].forEach(({ queue, handler }) => {
    rabbitmq.subscribe(queue, handler)
    queues.push(queue)
  })

  rabbitmq.subscribe('auth:queues', () => queues)
}

module.exports.init = init
