class Event {
  constructor() {
    this.handlers = {} // 事件队列
  }
  
  // 注册事件
  addEventListener(name, handler) {
    if (!(name in this.handlers)) {
      this.handlers[name] = []
    }
    this.handlers[name].push(handler) // 存入事件
  }

  // 触发事件
  dispatch(name, ...params) {
    if (name in this.handlers) {
      this.handlers[name].forEach(h => {
        h(...params)
      })
    } else {
      throw Error('You need add event the first')
    }
  }

  // 移除事件
  remove(name) {
    if (name in this.handlers) {
      delete this.handlers[name]
    }
  }
}

const event = new Event()
function log(message) {
  console.log(message)
}
event.addEventListener('log', log)
event.addEventListener('getColor', (f, c) => {
  console.log(`我从${f}采集了${c}！`)
})
// event.remove('log')
event.dispatch('log', 'Haha') // Haha
event.dispatch('getColor', '北京', 'Red') // Haha