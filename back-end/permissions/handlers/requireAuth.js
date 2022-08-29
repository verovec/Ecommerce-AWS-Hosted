const { errorResponse, successResponse} = require('../utils/response')

const requireAuth = ({ user } = {}) => {
  if (!user) {
    return errorResponse({
      message: 'Invalid or expired token',
      status: 403,
      code: 'FORBIDDEN_ERROR',
    })
  }

  return successResponse()
}

module.exports = {
  handler: requireAuth,
  queue: 'permissions:requireAuth',
}
