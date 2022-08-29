const moment = require('moment')
const jwt = require('jsonwebtoken')

const {
  secret: jwtSecret,
  expiration: jwtExpiration,
  timeUnit: jwtTimeUnit,
} = require('../config').jwt

const getTokenFromHeader = (req) => {
  const hasToken =
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')

  return hasToken ? req.headers.authorization.split(' ')[1] : null
}

const generateJWTToken = async ({
  user,
  expiration = jwtExpiration,
  timeUnit = jwtTimeUnit,
  secret = jwtSecret,
  extensions = {},
}) => {
  const payload = {
    exp: moment().add(expiration, timeUnit).unix(),
    user: { id: user.id, roles: user.roles },
    ...extensions,
  }
  return jwt.sign(payload, secret)
}

// Retrieves and verifies token
const getAndVerifyJWTToken = (requestObject) => {
  try {
    const token = getTokenFromHeader(requestObject)
    if (token) {
      const { user, ...extensions } = jwt.verify(token, jwtSecret)
      return { user, ...extensions }
    }
    return {
      user: null,
    }
  } catch (err) {
    return {
      user: null,
    }
  }
}

module.exports = {
  getAndVerifyJWTToken,
  generateJWTToken,
}
