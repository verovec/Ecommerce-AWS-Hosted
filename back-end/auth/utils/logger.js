const winston = require('winston')
const { inspect } = require('util')

const { format } = winston
function isError(e) {
  return e && e.stack && e.message
}
const warnAboutWinston = format((info) => {
  if (isError(info)) {
    console.log(
      'You should not use logger.error(err). Please use logger.error({err}) instead.'
    )
    return false
  }
  return info
})
const sillyWinstonConsoleFormatter = format.printf((info) => {
  let { message } = info
  if (isError(message)) {
    message = `${message.stack}`
  } else if (isError(info.err)) {
    message = `${message} ${info.err.stack}`
  } else if (message && isError(message.err)) {
    message = `${message} ${message.err.stack}`
  }
  const meta =
    info.meta !== undefined ? inspect(info.meta, { depth: null }) : ''
  return `[${info.timestamp}] ${info.level}: ${message} ${meta}`
})
const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.json(),
    format.prettyPrint(),
    warnAboutWinston(),
    sillyWinstonConsoleFormatter
  ),
  transports: [new winston.transports.Console()],
})

module.exports = logger
