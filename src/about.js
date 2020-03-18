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