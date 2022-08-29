module.exports.gateway = {
  port: process.env.GATEWAY_PORT || 4000,
}

module.exports.rabbitmq = {
  uri: process.env.RABBITMQ_URI || 'amqp://localhost',
}
