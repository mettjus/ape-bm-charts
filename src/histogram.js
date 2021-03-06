import React, {useEffect} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import * as d3 from 'd3'
import useResizeObserver from 'use-resize-observer'

const data = [
	{
		anno: 2014,
		consumo: 300,
	},
	{
		anno: 2015,
		consumo: 290,
	},
	{
		anno: 2016,
		consumo: 295,
	},
	{
		anno: 2017,
		consumo: 287,
	},
	{
		anno: 2018,
		consumo: 282,
	},
	{
		anno: 2019,
		consumo: 195,
	},
]

export const Histogram = ({
	color = '#69b3a2',
	backgroundColor = 'white',
	axisColor = 'black',
	getY = d => d.consumo,
	getX = d => d.anno,
	renderTooltip = d => <span>Consumo: {d.consumo}</span>,
} = {}) => {
	const [ref, width, height] = useResizeObserver()

	function draw(target, data) {
		// console.log('draw', target)
		if (!target) return
		while (target.firstChild) target.firstChild.remove()

		const xDomain = data.map(getX)
		const yDomain = [0, d3.max(data.map(getY)) * 1.1]

		// set the dimensions and margins of the graph
		var margin = {top: 10, right: 30, bottom: 30, left: 40},
			width = target.clientWidth - margin.left - margin.right,
			height = target.clientHeight - margin.top - margin.bottom

		// append the svg object to the body of the page
		var svg = d3
			.select(target)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		// X axis: scale and draw:
		// var x = d3
		//   .scaleLinear()
		//   .domain(xDomain) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
		//   .range([0, width])
		var x = d3
			.scaleBand()
			.rangeRound([0, width], 0.05)
			.padding(0.1)
			.domain(xDomain)

		svg
			.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x))
			.call(g => {
				g.selectAll('path').attr('stroke', axisColor)
				g.selectAll('line').attr('stroke', axisColor)
				g.selectAll('text').attr('fill', axisColor)
			})

		// Y axis: scale and draw:
		var y = d3.scaleLinear().range([height, 0])
		// y.domain([0, d3.max(bins, d => d.length)]) // d3.hist has to be called before the Y axis obviously
		y.domain(yDomain) // d3.hist has to be called before the Y axis obviously

		svg
			.append('g')
			.call(d3.axisLeft(y))
			.call(g => {
				g.selectAll('path').attr('stroke', axisColor)
				g.selectAll('line').attr('stroke', axisColor)
				g.selectAll('text').attr('fill', axisColor)
			})

		// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
		// Its opacity is set to 0: we don't see it by default.
		var tooltip = d3
			.select(target)
			.append('div')
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('top', '10px')
			.attr('class', 'tooltip')
			.style('background-color', 'rgba(0,0,0,.5)')
			.style('font-family', 'sans-serif')
			.style('font-size', '12px')
			.style('min-width', '80px')
			.style('color', 'white')
			.style('border-radius', '5px')
			.style('padding', '10px')
			.style('pointer-events', 'none')

		// A function that change this tooltip when the user hover a point.
		// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
		var showTooltip = function(d) {
			tooltip
				.transition()
				.duration(100)
				.style('opacity', 1)
			tooltip.html(renderToStaticMarkup(renderTooltip(d)))
			// .style('left', d3.mouse(ref.current)[0] + 20 + 'px')
			// .style('top', d3.mouse(ref.current)[1] + 'px')
		}
		var moveTooltip = function(d) {
			tooltip.style('top', d3.mouse(ref.current)[1] - 20 + 'px')
			const mouseX = d3.mouse(ref.current)[0]
			mouseX < 200
				? tooltip.style('left', mouseX + 20 + 'px')
				: tooltip.style('left', mouseX - 20 - 100 + 'px')
		}
		// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
		var hideTooltip = function(d) {
			tooltip
				.transition()
				.duration(200)
				.style('opacity', 0)
		}

		// append the bar rectangles to the svg element
		svg
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', 1)
			.attr('transform', d => 'translate(' + x(getX(d)) + ',' + y(getY(d)) + ')')
			.attr('width', x.bandwidth())
			.attr('height', d => height - y(getY(d)))
			.style('fill', color)
			// Show tooltip on hover
			.on('mouseover', showTooltip)
			.on('mousemove', moveTooltip)
			.on('mouseleave', hideTooltip)
	}

	useEffect(() => {
		// console.log('onSize', width, height)
		draw(ref.current, data || [])
	}, [data, width, height])

	return (
		<div
			ref={ref}
			style={{
				position: 'relative',
				backgroundColor,
				width: '100%',
				height: '100%',
				minHeight: 100,
			}}
		/>
	)
}
