exports.NODE_ENV = process.env.NODE_ENV || 'dev'

exports.APP_NAME = 'trynottolaugh-serverless'
exports.TARGET_REGION = process.env.TARGET_REGION

// :: DynamoDB resources
exports.DDB_PLAYERS = process.env.DDB_PLAYERS
exports.DDB_PHOTOSCORES = process.env.DDB_PHOTOSCORES

// :: Rekognition resources
exports.REKOG_MATCH_THRESHOLD = +process.env.REKOG_MATCH_THRESHOLD || 70
exports.REKOG_MINIMUM_FACE_SIZE = +process.env.REKOG_MINIMUM_FACE_SIZE || 0.25
