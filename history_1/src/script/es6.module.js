class Person { // ES6的类
  constructor () {
    this.name = 'Larry'
  }

  hobby () {
    console.log('my hobby is play ball')
  }
}

const start = () => {
  console.log('My name is', new Person().name)
  new Person().hobby()
}
export default start