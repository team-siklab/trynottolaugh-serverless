require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { createGame } = require('../utils/ddb')

// :: ---

exports.handler = (event, _, callback) => {
  logger.start('create-game')

  createGame()
    .then(data => {
      logger.debug(`:: [create-game] Game created.`)

      // :: data should include game id
      const { gameid } = data
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ gameid }),
        headers: {
          'Access-Control-Allow-Origins': '*',
          'Access-Control-Allow-Credentials': true
        }
      })
    })
    .catch(err => {
      logger.error(`:: [create-game] Error encountered while creating a game.`)
      logger.debug(JSON.stringify(err))

      callback(err)
    })
}
