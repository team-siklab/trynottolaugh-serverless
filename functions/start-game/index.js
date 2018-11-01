require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { assert } = require('../utils/assert')
const { startGame } = require('../utils/ddb')
const { CORS_HEADERS } = require('../utils/enums')

// :: ---

exports.handler = (event, context, callback) => {
  logger.start('start-game')
  logger.debug(JSON.stringify(event))

  const { gameid } = event.pathParameters
  const { timestamp } = JSON.parse(event.body || {})

  // :: failsafes
  const isSafe =
    assert(gameid, 'No Game Id specified.', callback) &&
    assert(timestamp, 'No start timestamp specified.', callback)

  if (!isSafe) return

  // :: ---

  startGame(gameid, timestamp)
    .then(data => {
      logger.debug(`:: [start-game] Game started: ${gameid}.`)

      // :: TODO
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { ...CORS_HEADERS }
      })
    })
    .catch(err => {
      // :: TODO filter based on error type
      logger.error(`:: [start-game] Error encountered while attempting to start game.`)
      logger.debug(JSON.stringify(err))

      callback(err)
    })
}
