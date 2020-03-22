const { AsyncSeriesHook } = require('tapable')
/**
 * 异步串行执行钩子，必须使用tapAsync注册钩子，使用
 * callAsync调用钩子，并且都用一个回调函数。串行的钩
 * 子将会按钩子代码位置从上到下的顺序执行。直到所有异步
 * 钩子执行完毕，再执行callAsync中的回调。
 * 
 * tapAsync(name, cb([params], cb))
 * 此方法中的回调函数有两个参数，params是callAsync
 * 函数传递的参数，cb是异步执行完的一个回调，在异步中
 * 必须执行此方法，用于计数执行了多少个异步钩子。
 * callAsync(name, cb)
 * 使用此方法与同步不同的是，参数多了一个回调函数，是所有
 * 异步钩子执行完毕的回调。
 */
class Event {
  constructor() {
    this.hooks = {
      created: new AsyncSeriesHook(['name'])
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