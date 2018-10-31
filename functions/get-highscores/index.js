require('../utils/aws-init')

// :: ---

exports.handler = (event, context, callback) => {
  // :: TODO
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      // :: TODO determine if this is actually required
      'Access-Control-Allow-Origins': '*'
    }
  })
}
