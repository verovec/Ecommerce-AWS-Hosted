const { parseUserIdFromParams } = require('../utils/commons')
const rabbitmq = require('../utils/rabbitmq')

const requireAuth = async (req) => {
  const response = await rabbitmq.publish('permissions:requireAuth', {
    user: req.user,
  })
  if (response.success) {
    parseUserIdFromParams(req)
  }

  return response
}

module.exports = requireAuth
