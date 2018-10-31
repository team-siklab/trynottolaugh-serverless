require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { startGame } = require('../utils/ddb')

// :: ---

exports.handler = (event, context, callback) => {
  logger.start('start-game')
  logger.debug(JSON.stringify(event))

  const { gameid } = event.pathParameters
  const { timestamp } = JSON.parse(event.body || {})

  startGame(gameid, timestamp)
    .then(data => {
      logger.debug(`:: [start-game] Game started: ${gameid}.`)

      // :: TODO
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origins': '*',
          'Access-Control-Allow-Credentials': true
        }
      })
    })
    .catch(err => {
      // :: TODO filter based on error type
      logger.error(`:: [create-game] Error encountered while attempting to start game.`)
      logger.debug(JSON.stringify(err))

      callback(err)
    })

  // :: TODO
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      // :: TODO determine if this is actually required
      'Access-Control-Allow-Origins': '*'
    }
  })
}
