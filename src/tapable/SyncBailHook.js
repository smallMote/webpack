const { SyncBailHook } = require('tapable') // 同步钩子保护机制（熔断险）

class Event {
  constructor() {
    this.hooks = {
      created: new SyncBailHook(['name'])
    }
  }
  // 启动钩子
  tap() {
    /**
     *  'createdHook' 没有实际意义，只是开发过程中的一个钩子的标识
     *  callback 回调中的参数是由call方法传递回来的
     */
    this.hooks.created.tap('Creating', (name) => {
      console.log('Creating', name)
      return 'stop' // 此处若不是返回undefined就会停止
    })
    this.hooks.created.tap('Created', (name) => {
      console.log('Created', name)
    })
  }
  // 触发钩子
  start() {
    this.hooks.created.call('Larry')
  }
}

const event = new Event()
event.tap()
event.start()