const { getAndVerifyJWTToken } = require('../utils/jsonwebtoken')

const getAuth = ({ headers } = {}) => {
  if (!headers)
    return {
      status: 403,
      success: false,
      error: {
        message: 'Please specify request headers',
        code: 'AUTH:INVALID_HEADERS',
      },
    }

  return {
    status: 200,
    success: true,
    data: {
      ...getAndVerifyJWTToken({ headers }),
    },
  }
}

module.exports = {
  queue: 'auth:getAuth',
  handler: getAuth,
}
