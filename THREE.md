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

### 手写插件（简单实现）
  在自定义插件中要有一个apply方法，接受一个compiler参数，也就是webpack执行对象，可以获取webpack的生命周期。
  ```
  // webpack生命周期
  this.hooks = { // 钩子函数(生命周期)
    entryOption: new SyncHook(), // 入口配置钩子
    compile: new SyncHook(), // 编译钩子
    afterCompile: new SyncHook(), // 编译完成后钩子
    afterPlugins: new SyncHook(), // 插件执行后钩子
    run: new SyncHook(), // 执行打包
    emit: new SyncHook(), // 文件发生
    done: new SyncHook() // 结束
  };
  ```
  webpack.config.js
  ```
  const EasyPlugins = require('./plugins/easy-plugins')
  module.exports = {
    ...
    plugins: [
      new EasyPlugins()
    ],
    ...
  }
  ```