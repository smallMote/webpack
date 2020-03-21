// import React from 'react'
// import { render } from 'react-dom'
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.css'
import lazy from './module/lazy'
console.log(lazy)
// const loadLazyModule = () => { // 懒加载
//   import('./module/lazy').then(res => {
//     console.log(res)
//   })
// }
// render(<div>
//   <button 
//     className="btn btn-success" 
//     type="button"
//     onClick={loadLazyModule}
//   >
//     Load Lazy Module
//   </button>
//   <button className="btn btn-danger" type="button">Button2</button>
//   <button className="btn btn-primary" type="button">Button3</button>
// </div>, document.getElementById('app'))

if (module.hot) {
  module.hot.accept('./module/lazy.js', () => {
    console.log('更新')
  })
}