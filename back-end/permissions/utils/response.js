const successResponse = (response) => ({
  status: 200,
  success: true,
  data: response,
})

const errorResponse = ({ message, status, code } = {}) => ({
  status: status || 500,
  success: false,
  error: {
    message: message || 'Internal server error',
    code: code || 'INTERNAL_SERVER_ERROR',
  },
})

const NotAuthorizedError = (message = 'Not Authorized') =>
  errorResponse({
    message,
    status: 403,
    code: 'NOT_AUTHORIZED_ERROR',
  })

module.exports = {
  Error,
  successResponse,
  errorResponse,
  NotAuthorizedError,
}
