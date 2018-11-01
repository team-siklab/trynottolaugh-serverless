const logger = require('./logger')

const checkNotFalsy = (item) => !!item

exports.assert = (item, message, cb, test = checkNotFalsy) => {
  const result = test(item)

  if (!result) {
    logger.error(message)

    cb(null, {
      statusCode: 422,
      body: JSON.stringify({
        type: 'error',
        message
      })
    })
  }

  return result
}
