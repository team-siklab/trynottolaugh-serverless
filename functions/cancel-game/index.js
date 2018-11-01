require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { assert } = require('../utils/assert')
const { cancelGame } = require('../utils/ddb')
const { CORS_HEADERS } = require('../utils/enums')

// :: ---

exports.handler = (event, context, callback) => {
  logger.start('cancel-game')
  logger.debug(JSON.stringify(event))

  const { gameid } = event.pathParameters

  // :: failsafes
  const isSafe =
    assert(gameid, 'No Game Id specified', callback)

  if (!isSafe) return

  // :: ---

  cancelGame(gameid)
    .then(data => {
      logger.debug(`:: [cancel-game] Game cancelled: ${gameid}.`)

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { ...CORS_HEADERS }
      })
    })
    .catch(err => {
      // :: TODO filter based on error type
      logger.error(`:: [cancel-game] Error encountered while attempting to cancel game.`)
      logger.debug(JSON.stringify(err))

      callback(err)
    })
}
