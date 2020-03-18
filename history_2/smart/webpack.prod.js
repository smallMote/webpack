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
  ]
})