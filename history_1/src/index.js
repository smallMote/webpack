import './script/image'
import Start6 from './script/es6.module'
import Start7 from './script/es7.module'
import createPerson from './script/generator.module'
require('@babel/polyfill')
require('./script/global.var')
require('./style/index.css')
require('./stylus/index.styl')
const str = require('./module.test')
console.log(str, 'test')
Start6()
Start7()
console.log('My name is ', createPerson('Generator Larry').next().value)