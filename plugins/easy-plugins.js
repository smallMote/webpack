class EasyPlugins {
  apply(compiler) {
    console.log('自定义插件');
    compiler.hooks.emit.tap('执行run方法的钩子', () => {
      console.log('执行run方法的钩子 run');
    });
    compiler.hooks.afterPlugins.tap('插件运行后', () => {
      console.log('插件运行后钩子 afterPlugins');
    });
    compiler.hooks.compile.tap('编译前钩子', () => {
      console.log('编译前钩子 compile');
    });
    compiler.hooks.afterCompile.tap('编译完成后钩子', () => {
      console.log('编译完成后钩子 afterCompile');
    });
    compiler.hooks.emit.tap('发射文件', () => {
      console.log('发射文件钩子 emit');
    });
    compiler.hooks.done.tap('webpack结束后的钩子', () => {
      console.log('webpack结束后的钩子 done');
    });
    compiler.hooks.entryOption.tap('进入webpack配置钩子', () => {
      console.log('进入webpack配置钩子 entryOption');
    });
  }
}
module.exports = EasyPlugins