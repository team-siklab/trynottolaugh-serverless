require('../utils/aws-init')

const logger = require('../utils/logger.js')
const { getSentiment } = require('../utils/rekog')
const { calculateScore, getFaceSize, reduceRecord, sortFaces } = require('./helpers')

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

/**
 * Gets the largest face from a Rekognition detectFaces response.
 * If there is no face, or if the largest face is not big enough,
 * the default face is passed back.
 *
 * @param {array} faces - The FaceDetails array from a Rekognition response payload.
 */
function getLargestFace (faces) {
  // :: if there are no faces in the list, then use the default face
  if (faces.length <= 0) {
    logger.warn(':: No face found --- using default face.')
    return MAXIMUM_SCORE_FACE
  }

  // :: if face is too small, use the default
  const facesize = getFaceSize(faces[0])
  logger.debug(`:: Face size is ${facesize}. Threshold is at ${REKOG_MINIMUM_FACE_SIZE}.`)
  if (facesize <= REKOG_MINIMUM_FACE_SIZE) {
    logger.warn(':: Face is too small --- using default face.')
    return MAXIMUM_SCORE_FACE
  }

  // :: else ---
  return faces[0]
}

// :: ---
//
exports.handler = (event, _, callback) => {
  logger.start('get-photo-score')

  const { s3 } = event.Records[0]
  logger.debug(`:: [get-photo-score] S3 object key is "${s3.object.key}".`)

  getSentiment(s3)
    .then(sortFaces)
    .then(getLargestFace)
    .then(face => ({ score: calculateScore(face), s3, ...face }))
    .then(reduceRecord)
    .then(face => {
      logger.debug(`:: [get-photo-score] Processing finished.`)
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
