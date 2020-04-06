/**
 * 处理css中的背景图片，将url中的粒径转换为require的方式
 * @param {string} source 
 */
function loader(source) { 
  const reg = /url\((.+?)\)/g; // 匹配url(path)
  let pos = 0;
  let current = null; // 当前匹配后返回的内容
  let codeArr = ['const list = []']; // 代码片段存储
  while(current = reg.exec(source)) {
    let [matchUrl, g] = current; // [url('../assets/1.png'), '../assets/1.png']
    let last = reg.lastIndex - matchUrl.length;
    codeArr.push(`list.push(${JSON.stringify(source.slice(pos, last))})`); // 第一段
    pos = reg.lastIndex;
    codeArr.push(`list.push('url(' + require(${g}) + ')')`); // 第二段（替换成require语法）
  }
  codeArr.push(`list.push(${JSON.stringify(source.slice(pos))})`); // 第三段
  codeArr.push(`module.exports = list.join('')`); // 转换成字符串导出
  return codeArr.join('\r\n');
}

module.exports = loader