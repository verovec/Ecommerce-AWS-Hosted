const { v4: uuidv4 } = require('uuid')

const amqp = require('amqplib')
const { rabbitmq } = require('../config')
const logger = require('./logger')

class Rabbitmq {
  constructor() {
    this._connection = null
    this._channel = null
    this._queue = null
    this._requests = {}
  }

  async connect() {
    try {
      this._connection = await amqp.connect(rabbitmq.uri)
      this._channel = await this._connection.createChannel()
      this._queue = await this._channel.assertQueue('', { exclusive: true })
      this._channel.consume(
        this._queue.queue,
        (response) => {
          const { correlationId } = response.properties
          const request = this._requests[correlationId]

          if (request) request.resolve(JSON.parse(response.content.toString()))

          delete this._requests[correlationId]
        },
        {
          noAck: true,
        }
      )
      logger.info('Rabbitmq Connection has been established successfully.')
    } catch (err) {
      logger.error({ err })
    }
  }

  subscribe(queue, callback) {
    try {
      this._channel.assertQueue(queue, { durable: false })
      this._channel.consume(queue, async (data) => {
        const response = await callback(JSON.parse(data.content.toString()))

        this._channel.sendToQueue(
          data.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          { correlationId: data.properties.correlationId }
        )
        this._channel.ack(data)
      })
    } catch (err) {
      logger.error({ err })
    }
  }

  async publish(queue, data = {}) {
    try {
      const correlationId = uuidv4()
      await this._channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(data)),
        {
          correlationId,
          replyTo: this._queue.queue,
        }
      )
      return new Promise((resolve) => {
        this._requests[correlationId] = { resolve }

        setTimeout(() => {
          if (this._requests[correlationId]) {
            delete this._requests[correlationId]

            resolve({
              success: false,
              status: 500,
              error: {
                message: 'Service timeout',
                code: 'SERVICE_TIMEOUT',
              },
            })
          }
        }, 5000)
      })
    } catch (err) {
      logger.error({ err })
    }
    return null
  }
}

module.exports = new Rabbitmq()
