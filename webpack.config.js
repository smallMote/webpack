const path = require('path')
const EasyPlugins = require('./plugins/easy-plugins')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename : 'bundle.pack.js'
  },
  resolveLoader: { // 解析loader配置,引入loader必须是绝对路径
    alias: { // 别名
      'url-loader': path.resolve(__dirname, 'loader', 'url-loader.js'),
      'babel-loader': path.resolve(__dirname, 'loader', 'babel-loader.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.less$/,
        use: [ // 加载自己编写的loader
          path.resolve(__dirname, 'loader', 'style-loader'),
          path.resolve(__dirname, 'loader', 'less-loader')
        ]
      },
      // {
      //   test: /\.(jpg|png|jpeg|gif)$/,
      //   loader: 'file-loader',
      // },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 20 * 1024 // 小于20kb的突变转换成base64
        }
      }
    ]
  },
  plugins: [
    new EasyPlugins()
  ]
}