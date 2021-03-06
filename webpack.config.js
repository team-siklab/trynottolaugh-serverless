const path = require('path')
const slsw = require('serverless-webpack')
// const externs = require('webpack-node-externals')

// :: ---

// const externsOptions = {
//   whitelist: [
//     'winston',
//     'logform',
//     'colors/safe'
//   ]
// }

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  externals: [
    { 'aws-sdk': 'commonjs aws-sdk' }
  ],
  // externals: [externs(externsOptions)],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}
