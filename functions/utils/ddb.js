const AWS = require('aws-sdk')
const { wrap } = require('dynamodb-data-types').AttributeValue
const uuid = require('uuid/v4')
const logger = require('./logger')
const { DDB_GAMES, DDB_PHOTOSCORES } = require('./env')

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
    Status: 'IN-LOBBY'
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
