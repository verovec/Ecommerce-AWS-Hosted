module.exports.api = {
  port: process.env.SERVICES_PORT || 4005,
}

module.exports.mysql = {
  uri: process.env.MYSQL_URI,
}

module.exports.rabbitmq = {
  uri: process.env.RABBITMQ_URI || 'amqp://localhost',
}

module.exports.elasticsearch = {
  uri: process.env.ELASTICSEARCH_URI || 'http://localhost:9200',
}
