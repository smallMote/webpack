const { SyncWaterfallHook } = require('tapable')
/**
 * 同步瀑布流
 * 上一个钩子return（返回的）结果会当走下一个钩子的参数,
 * 如果上一个钩子返回的是undefined，则上上个钩子的返回结
 * 果会传递下来当作参数，如果第一个钩子返回的是undefined
 * 那么第二个钩子的参数就会是call传递的参数
 */

class Event {
  constructor() {
    this.hooks = {
      created: new SyncWaterfallHook(['name'])
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
      return 'Creating Finished' // 此处返回的结果会当作下一个钩子的参数
    })
    this.hooks.created.tap('Created', (data) => {
      console.log('Created', data)
      return 'Created Finished' // 此处返回的结果会当作下一个钩子的参数
    })
    this.hooks.created.tap('Mounted', (data) => {
      console.log('Mounted', data)
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