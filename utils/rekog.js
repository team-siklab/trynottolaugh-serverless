const AWS = require('aws-sdk')

const logger = require('./logger')

const rekognition = new AWS.Rekognition()

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
