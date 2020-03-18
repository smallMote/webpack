const Webpack = require('webpack')
const { smart } = require('webpack-merge')
const baseWebpack = require('./webpack.config.base')
module.exports = smart(baseWebpack, {
  mode: 'development',
  devServer: {
    port: 3000,
    progress: true,
    open: false,
    contentBase: './build',
    compress: true,
    proxy: [ // 多路径代理
      {
        context: ['/api', '/auth'],
        target: 'http://localhost:10086',
        pathRewrite: {
          '^/api': '',
          '^/auth': '',
        }
      }
    ]
  },
  // devtool: 'source-map', // 会产生对应的.map文件
  // devtool: 'eval-source-map', // 不会产生.map文件，效果一样
  // devtool: 'cheap-module-source-map', // 产生.map文件，但不会在源码中提示
  devtool: 'cheap-module-eval-source-map', // 不产生.map文件，不会提示列，只有行
  watch: false,
  watchOptions: {
    poll: 1000, // 以毫秒为单位进行轮询(每秒检查一次变动)
    // 当第一个文件更改，会在重新构建前增加延迟。
    // 这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
    aggregateTimeout: 600,
    // ignored: /node_modules/, // 忽略的文件夹
    ignored: [/node_modules/, 'build'] // 忽略的文件夹
  },
  plugins: [
    new Webpack.DefinePlugin({ // 定义全局环境变量
      'DEV': JSON.stringify('dev')
    }),
  ]
})