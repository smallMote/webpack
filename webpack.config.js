const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename : 'bundle.pack.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [ // 加载自己编写的loader
          path.resolve(__dirname, 'loader', 'style-loader'),
          path.resolve(__dirname, 'loader', 'less-loader')
        ]
      }
    ]
  }
}