const { generateJWTToken } = require('../utils/jsonwebtoken')

const generateAuthToken = async ({ user } = {}) => {
  if (!user || !user.id || !user.roles)
    return {
      status: 403,
      success: false,
      error: {
        message: 'Please specify a valid user',
        code: 'AUTH:INVALID_USER',
      },
    }

  return {
    status: 200,
    success: true,
    data: {
      token: await generateJWTToken({ user }),
    },
  }
}

module.exports = {
  queue: 'auth:generateAuthToken',
  handler: generateAuthToken,
}
