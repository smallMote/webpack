import React from 'react'
import { render } from 'react-dom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

const loadLazyModule = () => { // 懒加载
  import('./module/lazy').then(res => {
    console.log(res)
  })
}
render(<div>
  <button 
    className="btn btn-success" 
    type="button"
    onClick={loadLazyModule}
  >
    Load Lazy Module
  </button>
  <button className="btn btn-danger" type="button">Button</button>
  <button className="btn btn-primary" type="button">Button</button>
</div>, document.getElementById('app'))