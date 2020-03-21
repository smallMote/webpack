const path = (p) => require('path').resolve(__dirname, p)
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  optimization: { // 优化项
    splitChunks: { // 代码分割
      cacheGroups: { // 缓存组
        commons: {
          name: 'myPublicCommon', // 自定义抽离出来的文件名称
          chunks: 'initial', // 初始化的时候使用 （all | initial | async）
          minSize: 0, // 文件最小大小
          minChunks: 2 // 最少引用两次及其以上菜抽取
        },
        vendor: { // 抽离第三方模块
          priority: 1, // 权重，让第三方模块现抽离
          name: 'vendor', // 自定义抽离出来的文件名称
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      },
    }
  },
  mode: 'development',
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].[hash:6].js'
  },
  devServer: {
    port: 3000,
    progress: true,
    open: false,
    contentBase: './build',
    compress: true
  },
  resolve: {
    alias: { 
      '~': path('src'),
      '~m': path('src/module')
    },
    enforceExtension: false, 
    extensions: ['.wasm', '.mjs', '.js', '.json', 'css', 'html'], 
    mainFiles: ['index', 'main'] 
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: { 
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path('src'), 
        exclude: /node_modules/ 
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'home.html',
      chunks: ['home', 'myPublicCommon', 'vendor'] // 引入公共模块
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'about.html',
      chunks: ['about', 'myPublicCommon', 'vendor'] 
    }),
    new CleanWebpackPlugin({ 
      verbose: true, 
    }),
    new Webpack.BannerPlugin({
      banner: '©Luckyoung',
      include: /script/,
    })
  ]
}