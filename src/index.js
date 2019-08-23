import React from 'react'
import ReactDOM from 'react-dom'
import GridLayout from 'react-grid-layout'
import { Histogram } from './histogram'
import './styles.css'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

function _App() {
  return (
    <div>
      <Histogram />
    </div>
  )
}

const App = () => {
  var layout = [
    { i: 'a', x: 0, y: 0, w: 3, h: 4 },
    { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
  ]
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      <div key="a" style={{ backgroundColor: 'red' }}>
        <Histogram style={{ width: '100%', height: '100%' }} />
      </div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
