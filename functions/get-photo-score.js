const logger = require('../utils/logger')

exports.handler = (event, context, callback) => {

  logger.debug(':: [get-photo-score] start.')

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      'Access-Control-Allow-Origins': '*'
    }
  })
}
