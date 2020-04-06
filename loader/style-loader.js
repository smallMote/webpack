// 将css源码插入到head标签中
const loaderUtils = require('loader-utils');
function loader(source) {
  return `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
}
/**
 * 使用pitch直接拿到资源去处理，然后返回给css-loader处理，
 * 最后拿到css-loader处理后的结果
 * 
 * 流程：style-loader -> less-loader!css-loader -> index.less
 */
loader.pitch = function pitch(remainingRequest) { // 剩余的请求
  return `
  let style = document.createElement('style');
  style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)}); // css处理好的路径
  document.head.appendChild(style);
`;
}
module.exports = loader;