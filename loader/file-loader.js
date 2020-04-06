const loaderUtils = require('loader-utils');
function loader(source) {
  const filename = loaderUtils.interpolateName(this, '[hash].[ext]', { content: source }); // 根据内容产生hash形式的图片路径
  // const options = loaderUtils.getOptions(this); // 获取loader的配置
  this.emitFile(filename, source); // 发射文件
  return `module.exports = '${filename}'`; // 当做模块返回出去
}
loader.raw = true; // 转换成2进制流
module.exports = loader