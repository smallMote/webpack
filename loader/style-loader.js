// 将css源码插入到head标签中
function loader(source) {
  return `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
}
module.exports = loader;