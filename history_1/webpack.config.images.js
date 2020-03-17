const path = require('path')
const Webpack = require('webpack')
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
    port: 3001,
    progress: true, // 进度条 
    open: false, // true -> 自动打开浏览器
    contentBase: './build', // 静态服务文件目录
    compress: true, // gzip压缩
  },
  mode: 'development', // 打包模式 production || development
  entry: './src/index.js', // 入口文件
  output: { // 打包后输出配置
    filename: 'bundle.[hash:6].js', // 输出文件名称([hash]添加hash戳，避免有缓存)
    path: path.resolve(__dirname, 'build') // 绝对路径
  },
  plugins: [ // 引用插件
    new HtmlWebpackPlugin({
      template: 'src/index.html', // 指定html模板
      filename: 'index.html', // 生成的文件名
      hash: true, // 添加hash戳
      minify: { // 打包配置
        removeAttributeQuotes: true, // 去除双引号
        collapseWhitespace: true, // 清除空格，成为一行
      },
    }),
    new MiniCssExtractPlugin({ // 抽离样式表为单独的一个文件
      filename: 'main.css',
    }),
    // 模块注入变量
    new Webpack.ProvidePlugin({
      $: 'jquery'
    })
  ],
  // 忽略打包的模块
  externals: {
    jquery: '$' // 不打包jquery模块
  },
  module: { // 模块配置
    /**
     * loader执行的顺序为从右到左、从下到上执行
     * loader的引入可以是数组，可以是字符串
     */
    rules: [ // 引入模块规则
      // {
      //   test: /\.js$/,
      //   enforce: 'pre', // 在位置上的下一个rules前执行
      //   loader: 'eslint-loader',
      //   include: path.resolve(__dirname, 'src'),
      //   exclude: /node_modules/,
      //   options: {
      //     cache: true // 缓存
      //   }
      // },
      // 全局暴露方式1
      // { 
      //   test: require.resolve("jquery"), 
      //   loader: "expose-loader?$" 
      // },
      // 全局暴露方式2
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: '$'
        },
        {
          loader: 'expose-loader',
          options: 'jQuery'
        }]
      },
      // js中引入图片处理
      // 默认使用ES模块语法的JS模块，生产中使用频率不高
      // {
      //   test: /\.(jpg|png|svg|jpeg|gif)$/,
      //   use: {
      //     loader: 'file-loader', 
      //     options: {
      //       // esModule: false // 关闭ES模块语法,不然会与html-withimg-loader冲突
      //     }
      //   }
      // },
      // js中引入图片处理,file-loader的增强版
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024, // 当图片小于200k是使用base64编码，减少对服务器的请求
            esModule: false // 关闭ES模块语法,不然会与html-withimg-loader冲突
          } 
        }
      },
      // html中引入图片处理
      {
        test: /\.html$/,
        loader: 'html-withimg-loader'
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
        include: path.resolve(__dirname, 'src'), // 只转换此文件夹下的js，绝对路径
        exclude: /node_modules/ // 排除该文件夹下的转换
      },
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