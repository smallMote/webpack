const { SyncLoopHook } = require('tapable')
/**
 * 循环执行（内部迭代原理）
 * 若钩子中有返回且返回的不是undefined那就会循环执行这个钩子，
 * 直到钩子中返回的是undefined。若多个钩子中，第n个钩子会返回
 * undefined，且n前面的所有钩子无返回，那他将会循环执行第一个
 * 钩子到第n个钩子的这个流程直到第n个钩子返回undefined为止。
 */

class Event {
  constructor() {
    this.count = 0
    this.hooks = {
      created: new SyncLoopHook(['name'])
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
    })
    this.hooks.created.tap('Created', (data) => {
      console.log('Created', data)
      this.count++
      return this.count === 3 ? undefined : 'done'
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