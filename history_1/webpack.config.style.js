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
      {
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
}