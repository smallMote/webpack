import $ from 'jquery'
import moment from 'moment'
import 'moment/locale/zh-cn'
console.log('about')
class Person {
  name = 'Larry'
}
console.log(Person)
console.log('test copyright')

moment.locale('zh-cn')
console.log(moment().endOf('day').fromNow())

require('./module/m1')
require('./module/m2')
console.log($)
document.body.append('About')