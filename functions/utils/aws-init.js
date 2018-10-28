const AWS = require('aws-sdk')
const { TARGET_REGION } = require('./env')

AWS.config.update({
  region: TARGET_REGION,
  apiVersions: {
    rekognition: '2016-06-27'
  }
})
