const babel = require('@babel/core');
const loaderUtils = require('loader-utils')
function loader(source) { // this -> loader处理器上下文对象
  const optios = loaderUtils.getOptions(this); // 获取loader配置
  const cb = this.async(); // 异步工具，实现异步返回
  babel.transform(source, {
    ...optios,
    sourceMaps: true, // 源码映射
  }, function(err, result) {
    cb(err, result.code, result.map)
  })
}
module.exports = loader