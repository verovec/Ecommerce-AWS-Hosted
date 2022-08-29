module.exports.permissions = {
  port: process.env.PORT || 4003,
}

module.exports.rabbitmq = {
  uri: process.env.RABBITMQ_URI || 'amqp://localhost',
}
