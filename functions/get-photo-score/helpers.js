const ENV = require('../utils/env')
const logger = require('../utils/logger')

/**
 * Calculates the proportional size of a bounded face in an image,
 * as bounded by the Rekognition service.
 *
 * @param {object} face - A face object, as specified by the Rekognition service.
 */
exports.getFaceSize = ({ BoundingBox }) => {
  return BoundingBox.Width * BoundingBox.Height
}

/**
 * Sorts a list of faces detected in a Rekognition query according to the size of their faces,
 * sorted from largest to smallest.
 *
 * @param {object} facedetails - The FaceDetails object, as returned by the Rekognition service.
 */
exports.sortFaces = (faces) => {
  return faces.sort((a, b) => {
    // :: descending order
    return -(exports.getFaceSize(a) - exports.getFaceSize(b))
  })
}

/**
 * Calculates the equivalent score of a given mugshot.
 *
 * @param {object} face - A FaceDetail object, as returned by the Rekognition service.
 */
exports.calculateScore = (face) => {
  logger.debug(':: Calculating score ...')
  logger.debug(JSON.stringify(face))

  const { Emotions } = face
  const emoScore = Emotions.reduce((a, emotion) => {
    const value = emotion.Confidence
    const multiplier = ENV[`SCORE_${emotion.Type}_MULTIPLIER`]

    return a + (value * multiplier)
  }, 0)

  // :: ---
  logger.debug(`:: Score calculated: [${emoScore}]`)
  return emoScore
}

/**
 * Reduces an enriched FaceDetail object into the payload for saving in a DynamoDB table.
 *
 * @param {object} face - Enriched FaceDetail object.
 */
exports.reduceRecord = (face) => {
  logger.debug(':: Reducing face record to DDB payload ...')
  logger.debug(JSON.stringify(face))

  const { s3, score } = face
  const [ gameid, objectkey ] = s3.object.key.split('/')
  const [ playerid, timestamp ] = objectkey.split('.')[0].split('_')

  const payload = {
    GameId: gameid,
    PlayerId: playerid,
    Timestamp: timestamp,
    Score: score,
    Bucket: s3.bucket.name,
    Key: s3.object.key
  }

  logger.debug(':: Payload created.')
  logger.debug(JSON.stringify(payload))

  return payload
}
