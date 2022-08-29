const { errorResponse } = require('../utils/response')

const validate = (schema) => async (req, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return { success: true }
  } catch (err) {
    return errorResponse({
      status: 400,
      message: err.message,
      code: 'VALIDATION_ERROR',
    })
  }
}

module.exports = validate
