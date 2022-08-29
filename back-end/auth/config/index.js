module.exports.jwt = {
  secret: process.env.JWT_SECRET,
  timeUnit: 'days',
  expiration: 90,
}

module.exports.auth = {
  port: process.env.PORT || 4002,
}

module.exports.rabbitmq = {
  uri: process.env.RABBITMQ_URI || 'amqp://localhost',
}
