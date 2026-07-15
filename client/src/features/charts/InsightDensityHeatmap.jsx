import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// Map a 0–10 intensity value to a blue shade
function intensityToColor(value, min, max) {
  if (value === null) return 'rgba(240,240,240,0.6)';
  const ratio = max === min ? 0.5 : (value - min) / (max - min);
  const r = Math.round(210 - ratio * 180);
  const g = Math.round(220 - ratio * 170);
  const b = Math.round(255 - ratio * 50);
  return `rgba(${r},${g},${b},0.85)`;
}

export default function InsightDensityHeatmap({ insightRecords }) {
  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const cells = {};
    const topicCount = {};

    insightRecords.forEach((record) => {
      if (!record.topic || record.likelihood == null || record.intensity == null) return;

      const bucket = Math.round(record.likelihood);
      const key = `${record.topic}|||${bucket}`;

      if (!cells[key]) cells[key] = { total: 0, count: 0 };
      cells[key].total += record.intensity;
      cells[key].count += 1;

      topicCount[record.topic] = (topicCount[record.topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic]) => topic);

    const buckets = [1, 2, 3, 4, 5];

    const cellList = topTopics.flatMap((topic, topicIdx) =>
      buckets.map((likelihood) => {
        const entry = cells[`${topic}|||${likelihood}`];
        return {
          topic,
          topicIdx,
          likelihood,
          avgIntensity: entry ? entry.total / entry.count : null,
          count: entry ? entry.count : 0,
        };
      })
    );

    const intensities = cellList
      .map((c) => c.avgIntensity)
      .filter((v) => v !== null);
    const minI = intensities.reduce((a, b) => Math.min(a, b), Infinity);
    const maxI = intensities.reduce((a, b) => Math.max(a, b), -Infinity);

    const datasets = [{
      label: 'Heatmap',
      data: cellList.map((c) => ({
        x: c.topicIdx,
        y: c.likelihood,
        r: 14,           // fixed bubble size = fixed cell size
        meta: c,
      })),
      backgroundColor: cellList.map((c) =>
        intensityToColor(c.avgIntensity, minI, maxI)
      ),
      borderColor: 'rgba(180,180,200,0.5)',
      borderWidth: 1,
    }];

    return { datasets, topTopics, buckets };
  }, [insightRecords]);

  if (!chartData) {
    return (
      <div className="no-data-state">
        <div className="no-data-icon">📭</div>
        <p>No data available</p>
      </div>
    );
  }

  const { datasets, topTopics, buckets } = chartData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e3a5f',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            const meta = items[0]?.raw?.meta;
            return meta ? meta.topic : '';
          },
          label: (ctx) => {
            const meta = ctx.raw?.meta;
            if (!meta) return '';
            return [
              ` Likelihood: ${meta.likelihood}`,
              ` Avg Intensity: ${meta.avgIntensity !== null ? meta.avgIntensity.toFixed(2) : 'N/A'}`,
              ` Records: ${meta.count}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: -0.7,
        max: topTopics.length - 0.3,
        ticks: {
          stepSize: 1,
          color: '#555',
          font: { size: 10 },
          callback: (val) => {
            const i = Math.round(val);
            return topTopics[i] !== undefined
              ? topTopics[i].length > 12 ? topTopics[i].slice(0, 12) + '…' : topTopics[i]
              : '';
          },
          maxRotation: 35,
          minRotation: 35,
        },
        grid: { color: '#f0f0f0' },
        title: { display: true, text: 'Topic', color: '#888', font: { size: 11 } },
      },
      y: {
        type: 'linear',
        min: 0.3,
        max: 5.7,
        ticks: {
          stepSize: 1,
          color: '#555',
          font: { size: 11 },
          callback: (val) => {
            const rounded = Math.round(val);
            return buckets.includes(rounded) ? `Likelihood ${rounded}` : '';
          },
        },
        grid: { color: '#f0f0f0' },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>
        Darker blue = higher avg intensity
      </p>
      <Bubble data={{ datasets }} options={options} />
    </div>
  );
}
