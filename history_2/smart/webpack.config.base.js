const path = (p) => require('path').resolve(__dirname, p)
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].[hash:6].js' // [name]于entry的键对应
  },
  resolve: {
    alias: { // 别名
      '~': path('src'),
      '~m': path('src/module')
    },
    enforceExtension: false, // 为true就必须指明扩展名，默认false
    extensions: ['.wasm', '.mjs', '.js', '.json', 'css', 'html'], // 自动解析扩展名
    mainFiles: ['index', 'main'] // 模块下默认导出的文件名称
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
          loader: 'babel-loader',// 处理高版本语法转低版本语法
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              // 处理ES7中的装饰器转换
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              // 处理ES7中的类转换
              ["@babel/plugin-proposal-class-properties", { "loose" : true }],
              // 处理生成器等一些高级内置语法
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path('src'), // 只转换此文件夹下的js，绝对路径
        exclude: /node_modules/ // 排除该文件夹下的转换
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'home.html',
      chunks: ['home'] // 引入代码块
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'about.html',
      chunks: ['about'] // 引入代码块
    }),
    new CleanWebpackPlugin({ // 默认删除output配置的文件夹
      verbose: true, // 控制台输出日志
    }),
    new CopyWebpackPlugin([ // 复制文件（夹）
      { from: './src', to: './source' }, // 将src下的文件和非空文件夹复制到build下的source文件夹下
    ]),
    new Webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}