const { parseUserIdFromParams } = require('../utils/commons')
const rabbitmq = require('../utils/rabbitmq')

const requireAdmin = async (req) => {
  const response = await rabbitmq.publish('permissions:requireAdmin', {
    user: req.user,
  })
  if (response.success) {
    parseUserIdFromParams(req)
  }

  return response
}

module.exports = requireAdmin
