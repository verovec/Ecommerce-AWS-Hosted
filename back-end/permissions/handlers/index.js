const requireAuth = require('./requireAuth')
const requireAdmin = require('./requireAdmin')
const canCreateAccountWithRole = require('./canCreateAccountWithRole')
const canManageUser = require('./canManageUser')
const isAdmin = require('./isAdmin')
const isSeller = require('./isSeller')
const rabbitmq = require('../utils/rabbitmq')

const init = () => {
  const queues = []

  ;[
    requireAuth,
    requireAdmin,
    canCreateAccountWithRole,
    canManageUser,
    isAdmin,
    isSeller,
  ].forEach(({ queue, handler }) => {
    rabbitmq.subscribe(queue, handler)
    queues.push(queue)
  })

  rabbitmq.subscribe('permissions:queues', () => queues)
}

module.exports.init = init
