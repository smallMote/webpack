const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TesterWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  optimization: { // 优化项
    minimizer: [ // 压缩
      new OptimizeCssPlugin(), // 压缩css，会覆盖webpack对js的压缩
      new TesterWebpackPlugin({ // 解决OptimizeCssPlugin对压缩覆盖js问题
        cache: true, // 支持缓存
        parallel: true, // 并发打包，同时压缩多个文件
      }),
    ]
  },
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
    }),
    new MiniCssExtractPlugin({ // 抽离样式表为单独的一个文件
      filename: 'main.css',
    })
  ],
  module: { // 模块配置
    /**
     * loader执行的顺序为从右到左、从下到上执行
     * loader的引入可以是数组，可以是字符串
     */
    rules: [ // 引入模块规则
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 生成单独的一个样式文件，放在head的最末尾
          'css-loader', // 主要解决@import问题
          'postcss-loader', // 解决浏览器前缀
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  }
}