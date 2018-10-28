const AWS = require('aws-sdk')
const { TARGET_REGION } = require('./env')

AWS.config.update({
  region: TARGET_REGION
})
