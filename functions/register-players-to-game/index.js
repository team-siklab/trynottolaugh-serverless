require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { assert } = require('../utils/assert')
const { CORS_HEADERS } = require('../utils/enums')

// :: ---

exports.handler = (event, context, callback) => {
  logger.start('register-player')
  logger.debug(JSON.stringify(event))

  const { gameid } = event.pathParameters

  // :: failsafes
  const isSafe =
    assert(gameid, 'No Game Id specified.', callback)

  if (!isSafe) return

  // :: TODO
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(event),
    headers: { ...CORS_HEADERS }
  })
}
