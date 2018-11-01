require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { assert } = require('../utils/assert')
const { CORS_HEADERS } = require('../utils/enums')

// :: ---

exports.handler = (event, context, callback) => {
  logger.start('end-game')
  logger.debug(JSON.stringify(event))

  const { gameid } = event.pathParameters
  const { timestamp } = JSON.parse(event.body || {})

  // :: failsafes
  const isSafe =
    assert(gameid, 'No Game Id specified.', callback) &&
    assert(timestamp, 'No end timestamp specified.', callback)

  if (!isSafe) return

  // :: ---

  // :: TODO
  callback(null, {
    statusCode: 200,
    headers: { ...CORS_HEADERS }
  })
}
