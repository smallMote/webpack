const path = (p) => require('path').resolve(__dirname, p)
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  mode: 'development', // development || production
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].[hash:6].js' // [name]于entry的键对应
  },
  devServer: {
    port: 3000,
    progress: true,
    open: false,
    contentBase: './build',
    compress: true,
    // proxy: { // 单路径代理
    //   '/api': {
    //     target: 'http://localhost:10086',
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
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
  resolve: {
    alias: { // 别名
      '~': path('src'),
      '~m': path('src/module')
    },
    enforceExtension: false, // 为true就必须指明扩展名，默认false
    extensions: ['.wasm', '.mjs', '.js', '.json', 'css', 'html'], // 自动解析扩展名
    mainFiles: ['index', 'main'] // 模块下默认导出的文件名称
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
    new Webpack.DefinePlugin({ // 定义全局环境变量
      'DEV': JSON.stringify('dev')
    }),
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
    new Webpack.BannerPlugin({
      banner: '©Luckyoung', // | function, // 其值为字符串或函数，将作为注释存在
      // raw: boolean, // 如果值为 true，将直出，不会被作为注释
      // entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
      include: /script/,
      // exclude: /source/,
    })
  ]
}