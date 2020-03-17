import Tmjs1 from '~/module/test.module'
import Tmjs2 from '~m/test.module'
import '~m' // main.js
import '~m/index.css'
console.log('home')
console.log(Tmjs1, Tmjs2)

function getCertList(path) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path, true)
  xhr.onload = () => {
    console.log('success!', JSON.parse(xhr.response))
  }
  xhr.send()
}
getCertList('/api/list')
getCertList('/auth/list')

console.log(DEV, process.env.NODE_ENV)