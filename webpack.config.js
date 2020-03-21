const path = (p) => require('path').resolve(__dirname, p)
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].[hash:6].js'
  },
  devServer: {
    hot: true, // 开启热更新
    index: 'index.html',
    // hotOnly: true, // 开启热更新,并关闭自动刷新
    port: 8080,
    contentBase: './build'
  },
  devtool: 'eval-source-map',
  resolve: {
    alias: { 
      '~': path('src'),
      '~m': path('src/module')
    },
    enforceExtension: false, 
    extensions: ['.wasm', '.mjs', '.js', '.json', 'css', 'html'], 
    mainFiles: ['index', 'main'] 
  },
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
      filename: 'index.html',
      chunks: ['main'] // 引入公共模块
    }),
    new CleanWebpackPlugin({ 
      verbose: true, 
    }),
    new Webpack.BannerPlugin({
      banner: '©Luckyoung',
      include: /script/,
    }),
    new Webpack.HotModuleReplacementPlugin() // 启用热更新插件
  ]
}