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

### 手写babel-loader
  依赖：
  ```
  yarn add @babel/core @babel/present-env loader-utils
  ```
  webpack.config.js
  ```
  module.exports = {
    ...
    resolveLoader: { // 解析loader配置,引入loader必须是绝对路径
      alias: { // 别名
        'babel-loader': path.resolve(__dirname, 'loader', 'babel-loader.js')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // presets必须是数组格式
          }
        },
      ]
    },
  }
  ...
  ```
  babel-loader.js
  ```
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
  ```
### 实现file-loader
  实现图片引入路径，可将图片当做模块引入，路径使用hash值代替。
  file-loader.js
  ```
  const loaderUtils = require('loader-utils');
  function loader(source) {
    const filename = loaderUtils.interpolateName(this, '[hash].[ext]', { content: source }); // 根据内容产生hash形式的图片路径
    this.emitFile(filename, source); // 发射文件
    return `module.exports = '${filename}'`; // 当做模块返回出去
  }
  loader.raw = true; // 转换成2进制流
  module.exports = loader
  ```
### 实现url-loader
  ```file-loader```的扩展，增加将小于一定大小的图片可转换为base64编码，有利于浏览器缓存，减少请求服务器的次数。  
  依赖：```file-loader```,```mime```: 识别文件类型
  ```
  yarn add mime
  ```
  url-loader.js
  ```
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
  ```