const AWS = require('aws-sdk')
const { wrap } = require('dynamodb-data-types').AttributeValue
const uuid = require('uuid/v4')
const logger = require('./logger')

const { DDB_GAMES, DDB_PHOTOSCORES } = require('./env')
const { GAME_STATES } = require('./enums')

const ddb = new AWS.DynamoDB()

// :: ---

/**
 * Creates a Game record on DDB.
 */
exports.createGame = (payload) => {
  logger.debug(':: Creating game ...')
  logger.debug(JSON.stringify(payload))

  const gameid = uuid()
  logger.debug(`:: Generated Game Id: ${gameid}`)

  const item = {
    GameId: gameid,
    Status: GAME_STATES.IN_LOBBY
  }

  const ddbpayload = {
    TableName: DDB_GAMES,
    Item: wrap(item),
    ReturnConsumedCapacity: 'TOTAL'
  }

  return new Promise((resolve, reject) => {
    ddb.putItem(ddbpayload, (err, data) => {
      if (err) {
        logger.error(':: Error encountered while generating game record on DB.')
        return reject(err)
      }

      // :: ---
      logger.debug(`:: Game record generated to DDB: ${gameid}`)
      logger.info(data)

      return resolve({ gameid })
    })
  })
}

/**
 * Starts a game.
 * Will result in an error if the game does not have enough players.
 *
 * @param {string} gameid - The Game ID of the game to start.
 * @param {string} timestamp - Timestamp to mark start of game.
 */
exports.startGame = (gameid, timestamp) => {
  logger.debug(':: Attempting to start game ...')

  // :: TODO check if game exists
  // :: TODO check for enough players
  // :: TODO check that game is IN-LOBBY

  const keymap = { GameId: gameid }
  const updatemap = {
    ':status': GAME_STATES.ONGOING,
    ':starttimestamp': timestamp
  }

  const ddbpayload = {
    TableName: DDB_GAMES,
    Key: wrap(keymap),
    ExpressionAttributeNames: {
      '#Status': 'Status',
      '#StartTimestamp': 'StartTimestamp'
    },
    ExpressionAttributeValues: wrap(updatemap),
    UpdateExpression: 'SET #Status = :status, #StartTimestamp = :starttimestamp',
    ReturnValues: 'ALL_NEW'
  }

  return new Promise((resolve, reject) => {
    ddb.updateItem(ddbpayload, (err, data) => {
      if (err) {
        logger.error(':: Error encountered while starting game.')
        logger.debug(JSON.stringify(err))
        return reject(err)
      }

      // :: ---
      logger.debug(`:: Game started: ${gameid}`)
      logger.info(data)

      return resolve({ gameid })
    })
  })
}

/**
 * Persists a score payload to the score DynamoDB table.
 *
 * @param {object} payload - Score payload.
 */
exports.saveScore = (payload) => {
  logger.debug(':: Saving score ...')
  logger.debug(JSON.stringify(payload))

  const ddbpayload = {
    TableName: DDB_PHOTOSCORES,
    Item: wrap(payload),
    ReturnConsumedCapacity: 'TOTAL'
  }

  return new Promise((resolve, reject) => {
    ddb.putItem(ddbpayload, (err, data) => {
      if (err) {
        logger.error(':: Error encountered while saving score to DDB.')
        return reject(err)
      } else {
        logger.debug(':: Score saved to DDB.')
        logger.info(JSON.stringify(data))

        return resolve(data)
      }
    })
  })
}
