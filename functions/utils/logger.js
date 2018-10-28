const { createLogger, transports, format } = require('winston')

// :: ---

const consoleTransport = new transports.Console()

const logger = createLogger({
  level: 'debug',
  format: format.simple(),
  transports: [
    consoleTransport
  ],
  // :: TODO figure something out for this if needed
  exceptionHandlers: [
    consoleTransport
  ]
})

// :: extension methods
logger.start = (subprocess) => logger.debug(`:: [${subprocess}] start.`)
logger.end = (subprocess) => logger.debug(`:: [${subprocess}] complete.`)

module.exports = logger
