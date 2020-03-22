const { AsyncSeriesBailHook } = require('tapable')
/**
 * 异步串行熔断险执行钩子，必须使用tapAsync注册钩子，使用
 * callAsync调用钩子，并且都用一个回调函数。串行的钩
 * 子将会按钩子代码位置从上到下的顺序执行。直到所有异步
 * 钩子执行完毕，再执行callAsync中的回调。
 * 
 * 在钩子回调的第二个参数回调函数中，此回调可以传递一个参数，
 * 此参数作为错误信息，将中断钩子的执行。直接调用callAsync
 * 的回调。
 */
class Event {
  constructor() {
    this.hooks = {
      created: new AsyncSeriesBailHook(['name'])
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
        cb('Error')
        clearTimeout(timer)
      }, 800);
    })
    this.hooks.created.tapAsync('mountedHook', (name, cb) => {
      const timer = setTimeout(() => {
        console.log('mountedHook', name)
        cb()
        clearTimeout(timer)
      }, 500);
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