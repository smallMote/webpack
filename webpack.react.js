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