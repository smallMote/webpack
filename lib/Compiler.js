const path = require('path');
module.exports = class Compiler {
  constructor(config) {
    // 获取配置
    this.config = config;
    // 保存入口文件的路径
    this.entryId = '';
    // 保存所有模块的依赖
    this.modules = {};
    // 入口路径
    this.entry = config.entry ;
    // 工作路径
    this.root = process.cwd();
  }
  bindModule(path, isEntry) {}
  run() {
    // 执行并创建模块的依赖关键
    this.bindModule(path.resolve(this.root, this.entry), true);
    // 发射文件 创建打包后的文件
    this.emitFile();
  }
}