const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'development', // development || production
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve( __dirname, 'build'),
    filename: 'script/[name].[hash:6].js' // [name]于entry的键对应
  },
  devServer: {
    port: 3000,
    progress: true,
    open: false,
    contentBase: './build',
    compress: true
  },
  devtool: 'cheap-module-eval-source-map', // 不产生.map文件，不会提示列，只有行
  watch: false,
  watchOptions: {
    poll: 1000, // 以毫秒为单位进行轮询(每秒检查一次变动)
    aggregateTimeout: 600,
    ignored: [/node_modules/, 'build'] // 忽略的文件夹
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.(js|jsx)$/,
        use: { 
          loader: 'babel-loader',// 处理高版本语法转低版本语法
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve( __dirname,'src'),
        exclude: /node_modules/
      },
    ],
  },
  plugins: [
    new Webpack.DllReferencePlugin({
      manifest: path.resolve( __dirname, 'build', 'manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    // new CleanWebpackPlugin({
    //   verbose: true
    // }),
    new Webpack.BannerPlugin({
      banner: '©Luckyoung',
      include: /script/,
    })
  ]
}