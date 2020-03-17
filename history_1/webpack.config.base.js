const path = require('path')
module.exports = {
  mode: 'development', // 打包模式 production || development
  entry: './src/index.js', // 入口文件
  output: { // 打包后输出配置
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // 绝对路径
  }
}