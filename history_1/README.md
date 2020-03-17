# Webpack(>4.0.0)
## 第一阶段
> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时，它会在内部构建一个 依赖图(dependency graph)，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle。

### 安装
```
yarn add webpack webpack-cli -D
```

### webpack可以0配置
- 打包工具 -> 输出后的结果（js模块）
- 默认打包出来的是production环境的文件
- 支持模块化打包（commonJs规范）

### 0配置打包
```
npx webpack
```
使用这句命令后，webpack-cli会在当前目录下查找./src/index.js，然后将index.js打包默认输出到./dist/main.js中。  
$\color{red}{*所以在使用该命令之前首先要有src -> index.js这样的目录结构}$

### 手动配置打包
- 默认配置文件名称为webpack.config.js,此文件是Node执行，所以语法规范要符合Node的语法规范。文件存放在执行命令的同级目录。可以使用自定义名称，但是打包命令就必须指向此文件。  
```
npx webpack --config [webpack配置文件]
```
- 在package.json文件中配置脚本命令
```
...
"scripts": {
  "build": "npx webpack"
},
...
```
然后可使用```npm run build```或者```yarn build```。主要看自己习惯哪一个包管理器。
### 开发服务（服务器插件）
开启服务器打包时，打包后的结果生成在内存中，方便预览。
```
yarn add webpack-dev-server -D
```
> 0配置启动后会生成以当前路径的静态目录
webpack.config.js中的常用配置：
```
devServer: { // 开发服务器配置
  port: 3000,
  progress: true, // 进度条 
  open: false, // true -> 自动打开浏览器
  contentBase: './build', // 静态服务文件目录
  compress: true, // gzip压缩
},
```
### 处理html文件
```
yarn add html-webpack-plugin -D
```
webpack.config.js中的常用配置：
```
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
```
### 处理css样式文件
```
yarn add style-loader css-loader -D
```
webpack.config.js中的基础配置：
```
module: { // 模块配置
  /**
    * loader执行的顺序为从右到左、从下到上执行
    * loader的引入可以是数组，可以是字符串
    */
  rules: [ // 引入模块规则
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader', // 可以解决将样式插入到html文件中
          options: { 
            insert: function insertAtTop(element) { // 将打包的css
              var parent = document.querySelector('head');
              var lastInsertedElement =
                window._lastElementInsertedByStyleLoader;
              if (!lastInsertedElement) {
                parent.insertBefore(element, parent.firstChild);
              } else if (lastInsertedElement.nextSibling) {
                parent.insertBefore(element, lastInsertedElement.nextSibling);
              } else {
                parent.appendChild(element);
              }
              window._lastElementInsertedByStyleLoader = element;
            },
            injectType: 'singletonStyleTag' // 将所有样式打包到一个style标签中
          }
        }, 
        'css-loader' // 主要解决@import问题
      ]
    },
    { // stylus 模块配置
      test: /\.styl$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag'
          }
        }, 
        'css-loader',
        'stylus-loader'
      ]
    }
  ]
}
```
webpack.config.js中的打包优化配置(抽离样式)：
需要用到下面四个插件
```
yarn add mini-css-extract-plugin optimize-css-assets-webpack-plugin terser-webpack-plugin autoprefixer -D
```
webpack.config.js压缩配置：
```
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
  ...
   plugins: [ // 引用插件
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
  },
  ...
}
```
package.json文件配置：
> 用于支持postcss和autoprefixer组合，解决自动添加浏览器前缀问题
```
"devDependencies": {
  ...
},
"browserslist": [
  "defaults",
  "not ie <= 8",
  "last 2 versions",
  "> 1%",
  "iOS >= 7",
  "Android >= 4.0"
]
```
### ES6/ES7/提案语法转换成低版本兼容语法
```
yarn add babel-loader @babel/core @babel/plugin-transform-runtime -D
yarn add @babel/runtime --save
```
ES6转换配置：
```
...
rules: [ // 引入模块规则
    ...
    {
      test: /\.js$/,
      use: { 
        loader: 'babel-loader',// 处理高版本语法转低版本语法
        options: {
          presets: [
            '@babel/preset-env' // 可以使用最新的js语法
          ],
          plugins: [
            // 处理生成器等一些高级内置语法
            "@babel/plugin-transform-runtime"
          ]
        }
      },
      include: path.resolve(__dirname, 'src'), // 只转换此文件夹下的js，绝对路径
      exclude: /node_modules/ // 排除该文件夹下的转换
    },
    ...
...
```
ES7转换支持：
```
yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
yarn add @babel/polyfill --save
```
配置：
```
...
rules: [ // 引入模块规则
    ...
    {
      test: /\.js$/,
      use: { 
        loader: 'babel-loader',// 处理高版本语法转低版本语法
        options: {
          presets: [
            '@babel/preset-env' // 可以使用最新的js语法
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
    ...
...
```
在入口文件引入@babel/polyfill文件：  
index.js
```
require('@babel/polyfill')
```
### 语法校验（eslint）
```
yarn add eslint eslint-loader -D
```
webpack.config.js配置：
```
...
rules: [ // 引入模块规则
    {
      test: /\.js$/,
      enforce: 'pre', // 在位置上的下一个rules前执行
      loader: 'eslint-loader',
      include: path.resolve(__dirname, 'src'),
      exclude: /node_modules/,
      options: {
        cache: true // 缓存
      }
    },
    ...
]
...
```
在项目根目录添加.eslintrc.json
```
{
	"parserOptions": {
		"ecmaVersion": 6,
		"sourceType": "module",
		"ecmaFeatures": {}
	},
	"rules": {
		"space-before-function-paren": 2,
    ...
	},
	"env": {}
}
```
### 全局变量引入
```
import $ from 'jquery'
console.log($) // func...
console.log(window.$) // undefined 打包后形成了闭包导致没有挂到window上
```
使用expost-loader的方式暴露到window上
```
import $ from 'expose-loader?$!jquery' // 内联loader的使用方式：[loader名称]?[字符串变量名称]![包名]
```
使用配置的方式
只要是使用了expose-loader，无论哪种方式都必须将要暴露的模块引入一次
boundle.js
```
require(jquery) 
```
// 方式1
```
// webpack.config.js
rules: [
  {
    test: require.reslove('jquery'),
    loader: 'expost-loader?$'
  }
]
```
方式2
```
// webpack.config.js
rules: [
  {
    test: require.resolve('jquery'),
    use: [{
      loader: 'expose-loader',
      options: '$'
    },
    // 多暴露
    {
      loader: 'expose-loader',
      options: 'jQuery'
    }]
  },
]
```
方式3，在每个模块注入对象
```
// webpack.config.js
// 不需要（在boundle.js）引入需要暴露的模块
const Webpack = require('webpack')
...
plugins: [
  // 模块注入变量
  new Webpack.ProvidePlugin({
    $: 'jquery'
  }) 
]
```
方式4，使用CDN引入且在模块中引用的时候不要打包此文件  
index.html
```
<html>
<head>
  <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
</head>
<body></body>
</html>
```
```
// webpack.config.js
...
module.exports = {
  plugins: [...],
  externals: {
    jquery: '$' // 不打包jquery模块
  },
  module: {...}
}
```
### 打包图片
+ 在css中引入图片是默认支持的，由css-loader处理
+ 在js中引入图片需要file-loader支持
```
yarn add file-loader -D // 使用频率低
yarn add url-loader -D // 使用频率高（file-loader的增强版）
```
+ 在html中引入图片需要html-withimg-loader支持
```
yarn add html-withimg-loader -D
```
webpack.config.js配置
```
rules: [
  // html中引入图片处理
  {
    test: /\.html$/,
    loader: 'html-withimg-loader'
  },
  // 默认使用ES模块语法的JS模块，生产中使用频率不高
  // {
  //   test: /\.(jpg|png|svg|jpeg|gif)$/,
  //   use: {
  //     loader: 'file-loader', 
  //     options: {
  //       esModule: false // 关闭ES模块语法,不然会与// html-withimg-loader冲突
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
  ...
]
```
### 资源分类打包
将不同的文件分类放在不同的文件夹中，然后使用publicPath设置公共资源路径，设置资源路径的时候，可以在```output```配置项中添加，将会作用到全部的文件，在不同的文件中配置publicPath则就是针对这一模块的资源路径，单独配置的权重大于公共配置的权重。
webpack.config.js
```
// 统一配置
module.exports = {
  ...
  output: {
    publicPath: 'http://wlittleyang.com'
  }
  ...
}
```
+ js
```
module.exports = {
  ...
  output: {
    filename: 'script/bundle.[hash:6].js', // 输出到script文件夹中
  }
  ...
}
```
+ css
```
plugins: {
  new MiniCssExtractPlugin({ // 抽离样式表为单独的一个文件
    filename: 'css/main.css', // 将css文件打包到css目录下
  }),
}
```
+ 图片
```
// 在url-loader下配置 outputPath: '/images/',
{
  test: /\.(jpg|png|svg|jpeg|gif)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 200 * 1024, // 当图片小于200k是使用base64编码，减少对服务器的请求
      esModule: false, // 关闭ES模块语法,不然会与html-withimg-loader冲突
      outputPath: '/images/', // 将图片打包到images目录下
      publicPath: 'http://baidu.com' // 单独添加公共路径，如CDN,单独的会覆盖统一的
    } 
  }
},
```

