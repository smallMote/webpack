const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  devServer: { // 开发服务器配置
    port: 3000,
    progress: true, // 进度条 
    open: false, // true -> 自动打开浏览器
    contentBase: './build', // 静态服务文件目录
    compress: true, // gzip压缩
  },
  mode: 'production', // 打包模式 production || development
  entry: './src/index.js', // 入口文件
  output: { // 打包后输出配置
    filename: 'bundle.[hash:6].js', // 输出文件名称([hash]添加hash戳，避免有缓存)
    path: path.resolve(__dirname, 'build') // 绝对路径
  },
  plugins: [ // 引用插件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定html模板
      filename: 'index.html', // 生成的文件名
      hash: true, // 添加hash戳
      minify: { // 打包配置
        removeAttributeQuotes: true, // 去除双引号
        collapseWhitespace: true, // 清除空格，成为一行
      },
    })
  ]
}