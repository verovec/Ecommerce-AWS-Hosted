const { errorResponse, successResponse } = require('../utils/response')
const { isAdmin } = require('../utils/permissions')

const requireAdmin = ({ user } = {}) => {
  if (!isAdmin(user)) {
    return errorResponse({
      message: 'Invalid permissions',
      status: 403,
      code: 'FORBIDDEN_ERROR',
    })
  }

  return successResponse()
}

module.exports = {
  handler: requireAdmin,
  queue: 'permissions:requireAdmin',
}
