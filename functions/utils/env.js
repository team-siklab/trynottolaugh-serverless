exports.NODE_ENV = process.env.NODE_ENV || 'dev'

exports.APP_NAME = 'trynottolaugh-serverless'
exports.TARGET_REGION = process.env.TARGET_REGION

exports.SCORE_HAPPY_MULTIPLIER = +process.env.SCORE_HAPPY_MULTIPLIER
exports.SCORE_SURPRISED_MULTIPLIER = +process.env.SCORE_SURPRISED_MULTIPLIER
exports.SCORE_DISGUSTED_MULTIPLIER = +process.env.SCORE_DISGUSTED_MULTIPLIER
exports.SCORE_CALM_MULTIPLIER = +process.env.SCORE_CALM_MULTIPLIER
exports.SCORE_SAD_MULTIPLIER = +process.env.SCORE_SAD_MULTIPLIER
exports.SCORE_ANGRY_MULTIPLIER = +process.env.SCORE_ANGRY_MULTIPLIER
exports.SCORE_CONFUSED_MULTIPLIER = +process.env.SCORE_CONFUSED_MULTIPLIER

// :: DynamoDB resources
exports.DDB_GAMES = process.env.DDB_GAMES
exports.DDB_PLAYERS = process.env.DDB_PLAYERS
exports.DDB_PHOTOSCORES = process.env.DDB_PHOTOSCORES

// :: Rekognition resources
exports.REKOG_MATCH_THRESHOLD = +process.env.REKOG_MATCH_THRESHOLD || 70
exports.REKOG_MINIMUM_FACE_SIZE = +process.env.REKOG_MINIMUM_FACE_SIZE || 0.25
exports.REKOG_FACE_COLLECTION = process.env.REKOG_FACE_COLLECTION
