import img from './assets/1.png'
console.log(img)
const $img = document.createElement('img')
$img.src = img
document.body.appendChild($img)

const r = require('./a.js')
require('./style/index.less')
console.log('@'+r)

class People {
  constructor(color) {
    this.color = color
  }
  get name() {
    return 'Luckyoung'
  }
}
const p = new People('Red')
console.log(p.name, p.color)