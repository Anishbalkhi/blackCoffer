import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

// Heatmap chart using D3 - shows intensity per topic and likelihood bucket
export default function InsightDensityHeatmap({ insightRecords }) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  const heatmapData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    // build cell data
    const cells = {};
    const topicCount = {};

    insightRecords.forEach((record) => {
      if (!record.topic || record.likelihood == null || record.intensity == null) return;
      const bucket = Math.round(record.likelihood);
      const key = record.topic + '|||' + bucket;
      if (!cells[key]) cells[key] = { total: 0, count: 0 };
      cells[key].total += record.intensity;
      cells[key].count += 1;
      topicCount[record.topic] = (topicCount[record.topic] || 0) + 1;
    });

    // get top 15 topics
    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([t]) => t);

    const buckets = [1, 2, 3, 4, 5];

    const cellList = topTopics.flatMap((topic) =>
      buckets.map((lk) => {
        const entry = cells[topic + '|||' + lk];
        return {
          topic,
          likelihood: lk,
          avgIntensity: entry ? entry.total / entry.count : null,
          count: entry ? entry.count : 0,
        };
      })
    );

    return { topTopics, buckets, cellList };
  }, [insightRecords]);

  useEffect(() => {
    if (!heatmapData || !svgRef.current || !wrapperRef.current) return;

    const { topTopics, buckets, cellList } = heatmapData;
    d3.select(svgRef.current).selectAll('*').remove();

    const containerW = wrapperRef.current.clientWidth || 640;
    const margin = { top: 30, right: 40, bottom: 90, left: 130 };
    const cellW = Math.max(30, Math.min(50, (containerW - margin.left - margin.right) / topTopics.length));
    const cellH = 44;
    const innerW = cellW * topTopics.length;
    const innerH = cellH * buckets.length;
    const totalW = innerW + margin.left + margin.right;
    const totalH = innerH + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', totalW)
      .attr('height', totalH);

    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xScale = d3.scaleBand().domain(topTopics).range([0, innerW]).padding(0.07);
    const yScale = d3.scaleBand().domain(buckets.map(String)).range([0, innerH]).padding(0.07);

    // color scale - light to dark blue
    const validValues = cellList.filter((c) => c.avgIntensity !== null).map((c) => c.avgIntensity);
    const colorScale = d3.scaleSequential()
      .domain([d3.min(validValues) || 0, d3.max(validValues) || 10])
      .interpolator(d3.interpolateBlues);

    // tooltip (must be declared before event handlers that reference it)
    const tooltip = d3.select(wrapperRef.current).select('.heatmap-tooltip');

    // draw cells
    g.selectAll('rect')
      .data(cellList)
      .join('rect')
      .attr('x', (d) => xScale(d.topic))
      .attr('y', (d) => yScale(String(d.likelihood)))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 3)
      .attr('fill', (d) => d.avgIntensity !== null ? colorScale(d.avgIntensity) : '#f5f5f5')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.7);
        tooltip
          .style('display', 'block')
          .html(
            '<strong>' + d.topic + '</strong><br/>' +
            'Likelihood: ' + d.likelihood + '<br/>' +
            'Avg Intensity: ' + (d.avgIntensity !== null ? d.avgIntensity.toFixed(2) : 'N/A') + '<br/>' +
            'Records: ' + d.count
          )
          .style('left', (event.offsetX + 14) + 'px')
          .style('top', (event.offsetY - 16) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.offsetX + 14) + 'px').style('top', (event.offsetY - 16) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        tooltip.style('display', 'none');
      });

    // cell labels
    if (xScale.bandwidth() > 34) {
      g.selectAll('text.val')
        .data(cellList.filter((c) => c.avgIntensity !== null))
        .join('text')
        .attr('class', 'val')
        .attr('x', (d) => xScale(d.topic) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(String(d.likelihood)) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#333')
        .attr('font-size', 9)
        .text((d) => d.avgIntensity.toFixed(1));
    }

    // x axis
    const xAxis = g.append('g').attr('transform', 'translate(0,' + innerH + ')').call(d3.axisBottom(xScale).tickSize(0));
    xAxis.select('.domain').attr('stroke', '#ccc');
    xAxis.selectAll('text').attr('fill', '#555').attr('font-size', 9).attr('dy', '1.2em').attr('transform', 'rotate(-38)').style('text-anchor', 'end');

    // y axis
    const yAxis = g.append('g').call(d3.axisLeft(yScale).tickSize(0));
    yAxis.select('.domain').attr('stroke', '#ccc');
    yAxis.selectAll('text').attr('fill', '#555').attr('font-size', 11);

    // y axis label
    svg.append('text').attr('transform', 'rotate(-90)').attr('x', -(margin.top + innerH / 2)).attr('y', 14).attr('text-anchor', 'middle').attr('fill', '#666').attr('font-size', 11).text('Likelihood Bucket');
  }, [heatmapData]);

  if (!heatmapData) {
    return (
      <div className="no-data-state">
        <div className="no-data-icon">📭</div>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <div
        className="heatmap-tooltip"
        style={{
          display: 'none',
          position: 'absolute',
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#333',
          pointerEvents: 'none',
          zIndex: 50,
          whiteSpace: 'nowrap',
          lineHeight: 1.6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      />
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
