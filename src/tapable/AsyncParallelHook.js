const { AsyncParallelHook } = require('tapable')
/**
 * 异步并行执行钩子，必须使用tapAsync注册钩子，使用
 * callAsync调用钩子，并且都用一个回调函数。无顺序，
 * 谁先执行完就记录一次，直到全部执行完就调callAsync
 * 中的回调。
 */
class Event {
  constructor() {
    this.hooks = {
      created: new AsyncParallelHook(['name'])
    }
  }
  tap() {
    this.hooks.created.tapAsync('creatingHook', (name, cb) => {
      const timer = setTimeout(() => {
        console.log('creatingHook', name)
        cb()
        clearTimeout(timer)
      }, 1000);
    })
    this.hooks.created.tapAsync('createdHook', (name, cb) => {
      const timer = setTimeout(() => {
        console.log('createdHook', name)
        cb()
        clearTimeout(timer)
      }, 900);
    })
  }
  start() {
    this.hooks.created.callAsync('Larry', () => {
      console.log('end')
    })
  }
}

const event = new Event()
event.tap()
event.start()