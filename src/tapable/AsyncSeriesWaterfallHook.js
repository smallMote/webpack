const { AsyncSeriesWaterfallHook } = require('tapable')
/**
 * 异步串行瀑布流形式执行钩子，必须使用tapAsync注册钩子，使用
 * callAsync调用钩子，并且有一个回调函数。串行的钩子将会按钩子
 * 代码位置从上到下的顺序执行。直到所有异步钩子执行完毕，再执行
 * callAsync中的回调。
 * 在钩子回调的第二个参数回调函数中，此回调可以传递两个参数cb(err, params)，
 * 使用了错误优先的设计模式，当err为null时，第二参数生效会传递
 * 给下一个钩子当作参数。
 */
class Event {
  constructor() {
    this.hooks = {
      created: new AsyncSeriesWaterfallHook(['name'])
    }
  }
  tap() {
    this.hooks.created.tapAsync('creatingHook', (name, cb) => {
      const timer = setTimeout(() => {
        console.log('creatingHook', name)
        cb(null, 'The creating is finished')
        clearTimeout(timer)
      }, 1000);
    })
    this.hooks.created.tapAsync('createdHook', (data, cb) => {
      const timer = setTimeout(() => {
        console.log('createdHook', data)
        cb(null, 'The created is finished')
        clearTimeout(timer)
      }, 500);
    })
    this.hooks.created.tapAsync('mountedHook', (data, cb) => {
      const timer = setTimeout(() => {
        console.log('mountedHook', data)
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