const logger = require('./logger')

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

const HandlerWithResponse = (handler) => async (req) => {
  try {
    const response = await handler(req)

    return successResponse(response)
  } catch (err) {
    if (err.status === 500 || !err.status) {
      logger.error('Handler internal server error: ', { err })
    }
    return errorResponse(err)
  }
}

const Error = ({ status, message, code } = {}) => {
  // eslint-disable-next-line no-throw-literal
  throw {
    status: status || 500,
    message: message || 'Internal server error',
    code: code || 'INTERNAL_SERVER_ERROR',
  }
}

const NotFoundError = (message = 'Not Found') => {
  Error({
    message,
    status: 404,
    code: 'NOT_FOUND_ERROR',
  })
}

const ValidationError = (message = 'Validation Error') => {
  Error({
    message,
    status: 400,
    code: 'VALIDATION_ERROR',
  })
}

const NotAuthorizedError = (message = 'Not Authorized') => {
  Error({
    message,
    status: 403,
    code: 'NOT_AUTHORIZED_ERROR',
  })
}

module.exports = {
  HandlerWithResponse,
  Error,
  NotFoundError,
  successResponse,
  errorResponse,
  ValidationError,
  NotAuthorizedError,
}
