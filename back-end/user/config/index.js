module.exports.api = {
  port: process.env.SERVICES_PORT || 4004,
}

module.exports.mysql = {
  uri: process.env.MYSQL_URI,
}

module.exports.rabbitmq = {
  uri: process.env.RABBITMQ_URI || 'amqp://localhost',
}
