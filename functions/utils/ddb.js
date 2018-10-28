const AWS = require('aws-sdk')
const { wrap } = require('dynamodb-data-types').AttributeValue
const logger = require('./logger')
const { DDB_PHOTOSCORES } = require('./env')

const ddb = new AWS.DynamoDB()

// :: ---

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
