# Webpack(>4.0.0)
## 第二阶段
### 打包多页应用
webpack.config.js
```
const path = (p) => require('path').resolve(__dirname, p)
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: { // 多入口
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].js' // [name]与entry的键对应
  },
  plugins: [
    // 几个html就需要new几次HtmlWebpackPlugin
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'home.html',
      chunks: ['home'] // 引入代码块，与entry的键对应
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'about.html',
      chunks: ['about'] // 引入代码块
    })
  ]
}
```
### 源码映射（source-map）
```
module.exports = {
  // devtool: 'source-map', // 会产生对应的.map文件
  // devtool: 'eval-source-map', // 不会产生.map文件，效果一样
  // devtool: 'cheap-module-source-map', // 产生.map文件，但不会在源码中提示
  devtool: 'cheap-module-eval-source-map', // 不产生.map文件，不会提示列，只有行
}
```
### 文件监测
当文件发送变化是，重新打包
```
module.exports = {
  watch: true, // 开启监测
  watchOptions: { // 监测配置
    poll: 1000, // 以毫秒为单位进行轮询(每秒检查一次变动)
    // 当第一个文件更改，会在重新构建前增加延迟。
    // 这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
    aggregateTimeout: 600,
    // ignored: /node_modules/, // 忽略的文件夹
    ignored: [/node_modules/, 'build']
  },
}
```
### 高频小工具插件的应用
```
yarn add clean-webpack-plugin copy-webpack-plugin -D
```
见名知意，一个是关于清除，一个是关于复制。  还有一个是webpack内置的插件：```BannerPlugin```
webpack.config.js
```
plugins: [
  new CleanWebpackPlugin({ // 删除output配置的文件夹
    verbose: true, // 控制台输出日志
  }),
  new CopyWebpackPlugin([ // 复制文件
    { from: './src', to: './source' }, 
    // 将src下的文件和非空文件夹复制到build下的source文件夹下,
    // 若source文件夹不存在则会创建该文件夹。
  ]),
  new Webpack.BannerPlugin({ // 在代码的最开始表明信息，以注释的形式。常常用来注明作者是谁。
    banner: '©Luckyoung', // | function, // 其值为字符串或函数，将作为注释存在
    // raw: boolean, // 如果值为 true，将直出，不会被作为注释
    // entryOnly: boolean, // 如果值为 true，将只在入口 chunks 文件中添加
    include: /script/,
    // exclude: /source/,
  })
]
```
### 使用webpack+express实现跨域请求
webpack默认使用的是express服务器，那我们可以通过配置代理的方式实现跨域请求。  
webpack.config.js
```
// 配置
module.exports = {
  proxy: { // 单路径代理
    '/api': {
      target: 'http://localhost:10086',
      pathRewrite: {
        '^/api': ''
      }
    }
  },
}
```
```
// 配置
module.exports = {
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
}
// eg:
function getCertList(path) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path, true)
  xhr.onload = () => {
    console.log('success!', JSON.parse(xhr.response))
  }
  xhr.send()
}
getCertList('/api/list')
getCertList('/auth/list')
```
### resolve（自定义模块解析规则）
webpack.config.js
```
module.exports = {
  ...
  resolve: {
    alias: { // 别名
      '~': path('src'),
      '~m': path('src/module')
    },
    enforceExtension: false, // 为true就必须指明扩展名，默认false
    extensions: ['.wasm', '.mjs', '.js', '.json', 'css', 'html'], // 自动解析扩展名
    mainFiles: ['index', 'main'] // 模块下默认导出的文件名称
  },
  ...
}
```
eg（home.js）:
```
import Tmjs1 from '~/module/test.module'
import Tmjs2 from '~m/test.module'
import '~m' // main.js
import '~m/index.css'
```
### 定义全局环境变量
在蒂尼环境变量的时候若要定义为一直确定的字符串值，使用SON.stringify转换，不然将会定义为一个全局的变量，若是其他类型，只需要添加一个单引号（双引号）就行，webpack最后会转换成正常的数据类型。
webpack.config.js
```
module.export = {
  plugins: [
    new Webpack.DefinePlugin({ // 定义全局环境变量
      'DEV': JSON.stringify('dev'), // 'dev' -> String
      'IS_SYSTEM': 'false', // false -> boolean
    }),
  ]
}
```
### 区分环境
1. 在模块中区分环境可以使用node的```process.env.NODE_ENV```对象，它将读取webpack中mode配置的值。
2. 使用webpack-merge插件中的smart对象耦合配置文件,smart会重组函数、合并数组与对象再运行配置文件。

```
yarn add webpack-merge -D
// 使用指定配置文件打包(调试)
npx webpack --config webpack.dev.js
npx webpack --config webpack.prod.js
npx webpack-dev-serve --config webpack.dev.js
```
webpack.config.base.js  
用来存放公共配置，也就是生产环境和开发环境都会用到的配置。
```
const path = (p) => require('path').resolve(__dirname, p)
module.exports = {
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  },
  output: {
    path: path('build'),
    filename: 'script/[name].[hash:6].js' // [name]于entry的键对应
  },
  ...
}
```
webpack.dev.js  
用来存放开发环境用到的配置
```
const { smart } = require('webpack-merge')
const baseWebpack = require('./webpack.config.base')
module.exports = smart(baseWebpack, {
  mode: 'development',
  devServer: {
    port: 3000,
    progress: true,
  },
  ...
}
```
webpack.prod.js  
用来存放开发环境用到的配置
```
const Webpack = require('webpack')
const { smart } = require('webpack-merge')
const baseWebpack = require('./webpack.config.base')

module.exports = smart(baseWebpack, {
  mode: 'production',
  plugins: [
    new Webpack.BannerPlugin({
      banner: '©Luckyoung',
      include: /script/
    })
  ],
  ...
})
```
### webpack优化
+ noParse 不去解析这个模块，如果里面有其他依赖模块也不会去解析。
  eg: ```noParse: /jquery/```
+ IgnorePlugin 忽略安装包中的一些文件（夹），不引用。
  eg: 
  ````
  // 使用moment库作为案例
  // webpack.config.js
  plugins: [
    new Webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
  // main.js
  import moment from 'moment'
  moment.locale('zh-cn') // 忽略后不生效
  import 'moment/locale/zh-cn' // 单独引入需要的资源
  console.log(moment().endOf('day').fromNow())
  ```
+ dllPlugin动态链接库 在如今SPA应用横行的年代，首屏加载一直是一个痛点，我们只有不断地减少打包的体积实现加载的速度，或者SSR。其中出色的框架有Vue、React等框架。这些框架的代码我们是不用去改变的，我们可以将其单独打包，放上依赖映射，从而减小项目体积。这里我就用React举个例子，来实现动态链接库。
  webpack.react.js 负责打包react的动态链接库
  ```
  const path = require('path')
  const Webpack = require('webpack')
  module.exports = {
    mode: 'development', // development || production
    entry: {
      react: ['react', 'react-dom']
    },
    output: {
      path: path.resolve(__dirname, 'dill'),
      filename: '_dll_[name].js',
      library: '_dll_[name]' // 动态链接库变量的名称
    },
    plugins: [
      new Webpack.DllPlugin({
        name: '_dll_[name]', // 动态链接库文件的名称
        path: path.resolve(__dirname, 'dill', 'manifest.json')  // 动态链接库的依赖指向列表
      })
    ]
  }
  ```
  webpack.config.js
  ```
  ...
  plugins: [
    new Webpack.DllReferencePlugin({ // 链接动态链接库，首先查找
      manifest: path.resolve( __dirname, 'build', 'manifest.json')
    }),
  ]
  ...
  ```
### 多线程打包
> 使用```happypack```插件实现，当项目小时我们可以使用线程比较少的方式打包，当项目大时使用多线程打包，因为启动线程也是需要一定时间的，灵活使用。
```
yarn add happypack -D
```
webpack.config.js
```
const Happypack = require('happypack')
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'happypack/loader?id=css'
      },
      {
        test: /\.(js|jsx)$/,
        use: 'happypack/loader?id=js', // 若不配置id 默认id从1递增
        include: path.resolve( __dirname,'src'),
        exclude: /node_modules/
      },
    ],
  },
  plugins: [
    new Happypack({
      id: 'js',
      threads: 1, // 默认线程3
      use: [
        { 
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
      ]
    }),
    new Happypack({
      id: 'css',
      threads: 1,
      loaders: ['style-loader', 'css-loader']
    }),
    ...
  ]
}
```
### webpack那些自带的打包优化
+ 在生产模式下，webpack打包会把```import``语法中没用的代码删除，这种模式叫tree-shaking，eg：
  ```
  // calc模块
  const sum = (a, b) => a + b
  const minus = (a, b) => a - b
  export default { sum, minus }
  // 使用
  import calc模块 from 'calc'
  console.log(calc.sum(1, 2))
  // 没有使用minus，打包后是没有minus函数的相关代码的
  ```
+ 当出现可计算表达式时，webpack在生产环境打包时往往是将计算的结果返回，eg:
  ```
  // 打包前
  let a = 1
  let b = 2
  let c = a + b
  // 打包后
  let a = 1
  let b = 2
  let c = 3
  ```
### 抽离公共代码（多页面应用）
webpack.config.js
```
module.exports = {
  optimization: { // 优化项
    splitChunks: { // 代码分割
      cacheGroups: { // 缓存组
        commons: {
          name: 'myPublicCommon', // 自定义模块名称
          chunks: 'initial', // 初始化的时候使用 （all | initial | async）
          minSize: 0, // 文件最小大小
          minChunks: 2 // 最少引用两次及其以上菜抽取
        }
      }
    }
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
    })
  ]
  ...
}
```