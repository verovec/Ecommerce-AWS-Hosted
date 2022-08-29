const rabbitmq = require('./rabbitmq')

const getAuth = async (headers) => {
  const { data: { user } = {} } = await rabbitmq.publish('auth:getAuth', {
    headers,
  })

  return user
}

module.exports = {
  getAuth,
}
