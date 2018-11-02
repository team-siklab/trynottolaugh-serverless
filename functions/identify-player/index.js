require('../utils/aws-init')

const logger = require('../utils/logger')
// const { identifyFace, indexPhoto } = require('../utils/rekog')
const { identifyFace } = require('../utils/rekog')

exports.handler = (event, context, callback) => {
  logger.start('identify-player')
  logger.debug(JSON.stringify(event))

  const { s3 } = event.Records[0]
  logger.debug(`:: [identify-player] S3 object key is "${s3.object.key}".`)

  // :: TODO attempt to identify face
  // :: TODO create player record if not identified
  // :: TODO relate player record to game record

  identifyFace(s3)
    .then(faces => {
      logger.debug(`:: [identify-player] Processing finished.`)
      logger.debug(JSON.stringify(faces))

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(faces)
      })
    })
    .catch(err => {
      logger.error(`:: [identify-player] Error encountered while trying to get sentiment from Rekognition.`)
      logger.debug(JSON.stringify(err))

      callback(err)
    })
}
