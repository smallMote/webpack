import React from 'react'
import { render } from 'react-dom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

render(<div>
  <button className="btn btn-success" type="button">Button</button>
  <button className="btn btn-danger" type="button">Button</button>
  <button className="btn btn-primary" type="button">Button</button>
</div>, document.getElementById('app'))