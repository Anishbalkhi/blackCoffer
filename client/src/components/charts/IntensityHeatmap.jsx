import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

export default function IntensityHeatmap({ data }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const processed = useMemo(() => {
    if (!data?.length) return null;

    // Group by topic × likelihood bucket, compute avg intensity
    const map = {};
    const topicCounts = {};

    data.forEach(({ topic, likelihood, intensity }) => {
      if (!topic || likelihood == null || intensity == null) return;
      const lBucket = Math.round(likelihood); // 1–5
      const key = `${topic}|||${lBucket}`;
      if (!map[key]) map[key] = { sum: 0, count: 0 };
      map[key].sum += intensity;
      map[key].count++;
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    // Top 15 topics by record count
    const topics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([t]) => t);

    const likelihoods = [1, 2, 3, 4, 5];

    const cells = [];
    topics.forEach((topic) => {
      likelihoods.forEach((lk) => {
        const entry = map[`${topic}|||${lk}`];
        cells.push({
          topic,
          likelihood: lk,
          avgIntensity: entry ? entry.sum / entry.count : null,
          count: entry ? entry.count : 0,
        });
      });
    });

    return { topics, likelihoods, cells };
  }, [data]);

  useEffect(() => {
    if (!processed || !svgRef.current || !containerRef.current) return;

    const { topics, likelihoods, cells } = processed;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 600;
    const margin = { top: 30, right: 30, bottom: 80, left: 120 };
    const cellSize = Math.max(32, Math.min(52, (containerWidth - margin.left - margin.right) / topics.length));
    const width = cellSize * topics.length;
    const height = cellSize * likelihoods.length;
    const totalWidth = width + margin.left + margin.right;
    const totalHeight = height + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', totalWidth)
      .attr('height', totalHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(topics)
      .range([0, width])
      .padding(0.08);

    const yScale = d3.scaleBand()
      .domain(likelihoods.map(String))
      .range([0, height])
      .padding(0.08);

    const intensityValues = cells
      .filter((c) => c.avgIntensity !== null)
      .map((c) => c.avgIntensity);

    const colorScale = d3.scaleSequential()
      .domain([d3.min(intensityValues) ?? 0, d3.max(intensityValues) ?? 10])
      .interpolator(d3.interpolateRgb('#1e1b4b', '#6366f1'));

    // Draw cells
    g.selectAll('rect.cell')
      .data(cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.topic))
      .attr('y', (d) => yScale(String(d.likelihood)))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', (d) =>
        d.avgIntensity !== null ? colorScale(d.avgIntensity) : 'rgba(255,255,255,0.03)'
      )
      .attr('stroke', 'rgba(255,255,255,0.06)')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.2s')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.75);
        // Tooltip
        tooltip
          .style('display', 'block')
          .html(
            `<strong>${d.topic}</strong><br/>
             Likelihood: ${d.likelihood}<br/>
             Avg Intensity: ${d.avgIntensity !== null ? d.avgIntensity.toFixed(2) : 'N/A'}<br/>
             Records: ${d.count}`
          )
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 20}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 20}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        tooltip.style('display', 'none');
      });

    // Value text inside cells
    g.selectAll('text.cell-label')
      .data(cells.filter((c) => c.avgIntensity !== null && xScale.bandwidth() > 38))
      .join('text')
      .attr('class', 'cell-label')
      .attr('x', (d) => (xScale(d.topic) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => (yScale(String(d.likelihood)) ?? 0) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'rgba(255,255,255,0.85)')
      .attr('font-size', 10)
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-weight', 600)
      .text((d) => d.avgIntensity.toFixed(1));

    // X Axis (topics)
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    xAxis.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    xAxis.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', 10)
      .attr('font-family', 'Inter, sans-serif')
      .attr('dy', '1.2em')
      .attr('transform', 'rotate(-35)')
      .style('text-anchor', 'end');

    // Y Axis (likelihood)
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0));

    yAxis.select('.domain').attr('stroke', 'rgba(255,255,255,0.1)');
    yAxis.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', 11)
      .attr('font-family', 'Inter, sans-serif')
      .attr('dx', '-0.5em');

    // Y label
    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(margin.top + height / 2))
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#5a6a8a')
      .attr('font-size', 11)
      .attr('font-family', 'Inter, sans-serif')
      .text('Likelihood');

    // Color legend bar
    const legendWidth = 120;
    const legendHeight = 8;
    const legendX = totalWidth - margin.right - legendWidth;
    const legendY = margin.top / 2 - legendHeight / 2;

    const defs = svg.append('defs');
    const lgId = 'heatmap-legend-grad';
    const linearGradient = defs.append('linearGradient').attr('id', lgId);
    linearGradient.selectAll('stop')
      .data(d3.range(0, 1.01, 0.1))
      .join('stop')
      .attr('offset', (d) => `${d * 100}%`)
      .attr('stop-color', (d) =>
        colorScale(d3.min(intensityValues) + d * (d3.max(intensityValues) - d3.min(intensityValues)))
      );

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('rx', 4)
      .attr('fill', `url(#${lgId})`);

    svg.append('text')
      .attr('x', legendX - 5)
      .attr('y', legendY + legendHeight / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#5a6a8a')
      .attr('font-size', 9)
      .text('Low');

    svg.append('text')
      .attr('x', legendX + legendWidth + 5)
      .attr('y', legendY + legendHeight / 2)
      .attr('text-anchor', 'start')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#5a6a8a')
      .attr('font-size', 9)
      .text('High');

    // Tooltip element
    const tooltip = d3.select(containerRef.current)
      .select('.heatmap-tooltip');

  }, [processed]);

  if (!processed) return (
    <div className="no-data">
      <div className="no-data-icon">📭</div>
      <p>No data with intensity & likelihood for current filters</p>
    </div>
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <div
        className="heatmap-tooltip"
        style={{
          display: 'none',
          position: 'absolute',
          background: 'rgba(10,15,30,0.95)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          color: '#94a3b8',
          pointerEvents: 'none',
          zIndex: 50,
          whiteSpace: 'nowrap',
          lineHeight: 1.6,
        }}
      />
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
