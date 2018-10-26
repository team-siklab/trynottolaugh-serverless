const { createLogger, transports, format } = require('winston')

const logger = createLogger({
  level: 'debug',
  format: format.simple(),
  transports: [
    new transports.Console()
  ],
  // :: TODO figure something out for this if needed
  exceptionHandlers: [
    new transports.Console()
  ]
})

exports = logger
