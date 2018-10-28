require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { getSentiment } = require('../utils/rekog')
const { getFaceSize, sortFaces } = require('./helpers')

const { REKOG_MINIMUM_FACE_SIZE } = require('../utils/env')

// :: ---

const MAXIMUM_SCORE_FACE = {
  BoundingBox: {
    Width: 1.0,
    Height: 1.0,
    Left: 0.0,
    Top: 0.0
  },
  Smile: {
    Value: true,
    Confidence: 99.99
  },
  EyesOpen: {
    Value: true,
    Confidence: 99.99
  },
  MouthOpen: {
    Value: true,
    Confidence: 99.99
  },
  Emotions: [
    {
      Type: 'HAPPY',
      Confidence: 99.99
    },
    {
      Type: 'SURPRISED',
      Confidence: 99.99
    },
    {
      Type: 'DISGUSTED',
      Confidence: 99.99
    }
  ],
  Pose: {
    Roll: 0.0,
    Yaw: 0.0,
    Pitch: 0.0
  },
  Confidence: 99.99,
  Remarks: 'Default face'
}

// :: ---
//
exports.handler = (event, _, callback) => {
  logger.start('get-photo-score')
  logger.debug(`:: [get-photo-score] Face size threshold is ${REKOG_MINIMUM_FACE_SIZE}.`)

  const { s3 } = event.Records[0]
  logger.debug(`:: [get-photo-score] S3 object key is "${s3.object.key}".`)

  getSentiment(s3)
    .then(faces => sortFaces(faces))
    .then(faces => {
      logger.debug(`:: [get-photo-score] Rekognition results received.`)

      // :: we only want one face, ideally the biggest
      //    if we can't find a face, then we put one with maximum score values as penalty
      if (faces.length <= 0) {
        logger.info(':: [get-photo-score] No face found --- using default face.')
        return MAXIMUM_SCORE_FACE
      }

      const facesize = getFaceSize(faces[0])

      logger.debug(`:: [get-photo-score] Face size is ${facesize}.`)

      if (facesize <= REKOG_MINIMUM_FACE_SIZE) {
        logger.info(':: [get-photo-score] Face is not big enough --- using default face.')
        return MAXIMUM_SCORE_FACE
      }

      // :: else
      return faces[0]
    })
    .then(face => {
      logger.debug(JSON.stringify(face))

      callback(null, {
        statusCode: 200,
        body: JSON.stringify({}),
        headers: {
          // :: TODO determine if this is actually required
          'Access-Control-Allow-Origins': '*'
        }
      })
    })
    .catch(err => {
      logger.error(`:: [get-photo-score] Error encountered while trying to get sentiment from Rekognition.`)
      callback(err)
    })
}
