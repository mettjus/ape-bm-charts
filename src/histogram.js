import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { withSize } from 'react-sizeme'
import useResizeObserver from 'use-resize-observer'

export const Histogram = () => {
  const [ref, width, height] = useResizeObserver()
  const [data, setData] = useState(null)
  function draw(target, data) {
    console.log('draw', target)
    if (!target) return
    while (target.firstChild) target.firstChild.remove()

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
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
    var x = d3
      .scaleLinear()
      .domain([0, 1000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
    // set the parameters for the histogram
    var histogram = d3
      .histogram()
      .value(d => d.price) // I need to give the vector of value
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(70)) // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data)

    // Y axis: scale and draw:
    var y = d3.scaleLinear().range([height, 0])
    y.domain([0, d3.max(bins, d => d.length)]) // d3.hist has to be called before the Y axis obviously

    svg.append('g').call(d3.axisLeft(y))

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3
      .select(target)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'black')
      .style('color', 'white')
      .style('border-radius', '5px')
      .style('padding', '10px')

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style('opacity', 1)
      tooltip
        .html('Range: ' + d.x0 + ' - ' + d.x1)
        .style('left', d3.mouse(this)[0] + 20 + 'px')
        .style('top', d3.mouse(this)[1] + 'px')
    }
    var moveTooltip = function(d) {
      tooltip
        .style('left', d3.mouse(this)[0] + 20 + 'px')
        .style('top', d3.mouse(this)[1] + 'px')
    }
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style('opacity', 0)
    }

    // append the bar rectangles to the svg element
    svg
      .selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', 1)
      .attr('transform', d => 'translate(' + x(d.x0) + ',' + y(d.length) + ')')
      .attr('width', d => x(d.x1) - x(d.x0) - 1)
      .attr('height', d => height - y(d.length))
      .style('fill', '#69b3a2')
      // Show tooltip on hover
      .on('mouseover', showTooltip)
      .on('mousemove', moveTooltip)
      .on('mouseleave', hideTooltip)
  }

  useEffect(() => {
    console.log('onSize', width, height)
    draw(ref.current, data || [])
  }, [data, width, height])

  useEffect(() => {
    d3.csv(
      'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv',
    ).then(data => setData(data))
  }, [])
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'tomato',
        width: '100%',
        height: '100%',
        minHeight: 100,
      }}
    />
  )
}
