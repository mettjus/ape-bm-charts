import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import GridLayout from 'react-grid-layout'
import {Histogram} from './histogram'
import * as ls from './localstorage'

import './styles.css'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {HistogramBenchmark} from './histogram-benchmark'

const defaultLayoutProps = {
	w: 4,
	h: 8,
	x: 0,
	y: 0,
	// , minW: 2, maxW: 4
}

const originalLayout = ls.read() || [
	{...defaultLayoutProps, i: 'a'},
	{...defaultLayoutProps, i: 'b', x: 4},
	{...defaultLayoutProps, i: 'c', x: 8},
]

const App = () => {
	const [layout, setLayout] = useState(originalLayout)
	return (
		<GridLayout
			className="layout"
			layout={layout}
			cols={12}
			rowHeight={30}
			width={1200}
			onLayoutChange={layout => {
				setLayout(layout)
				ls.save(layout)
			}}
		>
			<div key="a" style={{backgroundColor: 'red'}}>
				<Histogram
					getY={d => d.consumo}
					getX={d => d.anno}
					renderTooltip={d => <span>Consumo: {d.consumo}</span>}
				/>
			</div>
			<div key="b" style={{backgroundColor: 'red'}}>
				<Histogram
					getY={d => d.consumo}
					getX={d => d.anno}
					renderTooltip={d => <span>Consumo: {d.consumo}</span>}
					color="pink"
					backgroundColor="purple"
					axisColor="azure"
				/>
			</div>
			<div key="c" style={{backgroundColor: 'red'}}>
				<HistogramBenchmark
					getY={d => d.consumo}
					getX={d => d.anno}
					renderTooltip={d => <span>Consumo: {d.consumo}</span>}
					colors={['pink', 'green', 'blue']}
					// backgroundColor="purple"
					// axisColor="azure"
				/>
			</div>
		</GridLayout>
	)
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
