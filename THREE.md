# 手写webpack
[toc]
### 构建自定义命令
  因为这是单独的全局功能模块，源码请移步至  
  [https://github.com/smallMote/ypack.git](https://github.com/smallMote/ypack.git)
### 手写loader
  > 这里以处理less文件实现简易less-loader和style-loader

  style-loader：将css源码插入到head标签中
  ```
  function loader(source) {
    return `
      let style = document.createElement('style');
      style.innerHTML = ${JSON.stringify(source)};
      document.head.appendChild(style);
    `;
  }
  module.exports = loader;
  ```
  less-loader：将less语法转换成css语法
  ```
  // loader依赖
  yarn add less -D
  ```
  ```
  const less = require('less');
  // 将less转换成css
  function loader(source) {
    let css = '';
    less.render(source, (err, c) => {
      css = c.css;
    });
    css = css.replace(/\n/g, '\\n');
    return css;
  }
  module.exports = loader;
  ```