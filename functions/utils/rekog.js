const AWS = require('aws-sdk')

const logger = require('./logger')
const { REKOG_FACE_COLLECTION, REKOG_MATCH_THRESHOLD } = require('./env')

const rekognition = new AWS.Rekognition()

/**
 * Checks if a face is already known.
 */
exports.identifyFace = ({ bucket, object }) => {
  const payload = {
    CollectionId: REKOG_FACE_COLLECTION,
    FaceMatchThreshold: REKOG_MATCH_THRESHOLD,
    Image: {
      S3Object: {
        Bucket: bucket.name,
        Name: object.key
      }
    }
  }

  return new Promise((resolve, reject) => {
    logger.debug(`:: Requesting Rekognition service ...`)
    logger.debug(JSON.stringify(payload))

    rekognition.searchFacesByImage(payload, (err, data) => {
      logger.debug(`:: Rekognition response received.`)
      logger.debug(JSON.stringify(data))

      if (err) return reject(err)
      // :: ---
      return resolve(data.FaceMatches)
    })
  })
}

/**
 * Indexes the photo and adds faces to the face collection.
 */
exports.indexPhoto = ({ bucket, object }) => {
  const payload = {
    CollectionId: REKOG_FACE_COLLECTION,
    DetectionAttributes: ['DEFAULT'],
    ExternalImageId: `${bucket.name}:::${object.key}`,
    // MaxFaces: 1, // :: for some reason, this isn't working
    Image: {
      S3Object: {
        Bucket: bucket.name,
        Name: object.key
      }
    }
  }

  return new Promise((resolve, reject) => {
    logger.debug(`:: Requesting Rekognition service ...`)
    logger.debug(JSON.stringify(payload))

    rekognition.indexFaces(payload, (err, data) => {
      logger.debug(`:: Rekognition response received.`)
      logger.debug(JSON.stringify(data))

      if (err) return reject(err)
      // :: ---
      return resolve(data.FaceRecords)
    })
  })
}

/**
 * Uses the Rekognition detectFaces API to determine
 * image facial sentiment.
 *
 * @param {object} s3object - An S3 hashmap as provided through Lambda proxy integration.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Rekognition.html#detectFaces-property}
 */
exports.getSentiment = ({ bucket, object }) => {
  const payload = {
    Image: {
      S3Object: {
        Bucket: bucket.name,
        Name: object.key
      }
    },
    Attributes: ['ALL']
  }

  return new Promise((resolve, reject) => {
    logger.debug(`:: Requesting Rekognition service ...`)
    rekognition.detectFaces(payload, (err, data) => {
      logger.debug(`:: Rekognition response received.`)
      logger.debug(JSON.stringify(data))

      if (err) return reject(err)
      // :: ---
      return resolve(data.FaceDetails)
    })
  })
}
