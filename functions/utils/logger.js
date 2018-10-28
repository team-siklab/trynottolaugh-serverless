const { createLogger, transports, format } = require('winston')
// const WinstonCloudWatch = require('winston-cloudwatch')

// const { APPNAME, NODE_ENV } = require('./env')

// :: ---

const consoleTransport = new transports.Console()

// const cloudwatchTransport = new WinstonCloudWatch({
//   name: 'cloudwatch-logstream',
//   logGroupName: APPNAME,
//   logStreamName: NODE_ENV
// })

const logger = createLogger({
  level: 'debug',
  format: format.simple(),
  transports: [
    consoleTransport
    // cloudwatchTransport
  ],
  // :: TODO figure something out for this if needed
  exceptionHandlers: [
    consoleTransport
    // cloudwatchTransport
  ]
})

// :: extension methods
logger.start = (subprocess) => logger.debug(`:: [${subprocess}] start.`)
logger.end = (subprocess) => logger.debug(`:: [${subprocess}] complete.`)

module.exports = logger
