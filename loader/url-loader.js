const loaderUtils = require('loader-utils');
const mime = require('mime'); // 识别文件类型
function loader(source) {
  let limit = loaderUtils.getOptions(this).limit;
  if (limit && limit > source.length) {
    // this.resourcePath 处理资源路径
    return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`;
  } else {
    return require('./file-loader').call(this, source);
  }
}
loader.raw = true; // 转换成2进制流
module.exports = loader