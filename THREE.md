### 手写webpack

+ 构建自定义命令
  - 在```package.json```中添加bin配置配置需要执行的文件。如：我需要配置一个pack命令，并且使用node环境默认运行当前目录下的```pack.js```文件。
    package.json
    ```
    "bin": {
      "pack": "./pack.js"
    }
    ```
    pack.js
    ```
    #! /usr/bin/env node // 指明运行的环境
    console.log('pack is start!')
    ```
  - 链接文件
    terminal
    ```
    // 在pack.js同级目录下
    sudo npm link // 将package.json配置抛到全局
    sudo mpm link pack.js // 链接文件
    ```
  - 运行文件
    terminal
    ```
    pack // pack is start!
    npx pack // pack is start!
    ```