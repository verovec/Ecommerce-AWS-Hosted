const rabbitmq = require('./rabbitmq')

const parseUserIdFromParams = (req) => {
  if (req.params.userId) {
    if (req.params.userId === 'me') {
      req.params.userId = req.user.id
    }
    req.params.userId = parseInt(req.params.userId, 10)
  }
}

const generateAuthToken = async ({ id, roles }) => {
  const { data: { token } = {} } = await rabbitmq.publish(
    'auth:generateAuthToken',
    {
      user: { id, roles },
    }
  )

  return token
}

module.exports = {
  parseUserIdFromParams,
  generateAuthToken,
}
