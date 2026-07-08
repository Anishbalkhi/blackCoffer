import React, { useMemo } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const COLORS = [
  'rgba(30, 58, 95, 0.8)',
  'rgba(0, 121, 107, 0.8)',
  'rgba(230, 81, 0, 0.8)',
  'rgba(106, 27, 154, 0.8)',
  'rgba(21, 101, 192, 0.8)',
  'rgba(46, 125, 50, 0.8)',
  'rgba(198, 40, 40, 0.8)',
  'rgba(0, 96, 100, 0.8)',
  'rgba(74, 20, 140, 0.8)',
  'rgba(13, 71, 161, 0.8)',
  'rgba(1, 87, 155, 0.8)',
  'rgba(0, 77, 64, 0.8)',
];

export default function MetricCorrelationBubble({ insightRecords }) {
  const datasets = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const sectorData = {};
    insightRecords.forEach((record) => {
      if (record.intensity == null && record.likelihood == null && record.relevance == null) return;
      const sector = record.sector || 'Other';
      if (!sectorData[sector]) {
        sectorData[sector] = { intensityTotal: 0, likelihoodTotal: 0, relevanceTotal: 0, count: 0 };
      }
      if (record.intensity != null) sectorData[sector].intensityTotal += record.intensity;
      if (record.likelihood != null) sectorData[sector].likelihoodTotal += record.likelihood;
      if (record.relevance != null) sectorData[sector].relevanceTotal += record.relevance;
      sectorData[sector].count += 1;
    });

    const sectorList = Object.entries(sectorData).map(([sector, data]) => ({
      sector,
      avgIntensity: data.count > 0 ? data.intensityTotal / data.count : 0,
      avgLikelihood: data.count > 0 ? data.likelihoodTotal / data.count : 0,
      avgRelevance: data.count > 0 ? data.relevanceTotal / data.count : 0,
    }));

    if (sectorList.length === 0) return null;

    return sectorList.map((item, index) => ({
      label: item.sector,
      data: [{
        x: parseFloat(item.avgIntensity.toFixed(2)),
        y: parseFloat(item.avgLikelihood.toFixed(2)),
        r: Math.max(5, Math.min(25, item.avgRelevance * 5)),
      }],
      backgroundColor: COLORS[index % COLORS.length],
      borderColor: 'white',
      borderWidth: 1.5,
    }));
  }, [insightRecords]);

  if (!datasets) {
    return (
      <div className="no-data-state">
        <div className="no-data-icon">📭</div>
        <p>No data available</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#333', font: { size: 10 }, boxWidth: 12, padding: 6, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e3a5f',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
        callbacks: {
          title: (items) => items[0]?.dataset?.label ?? '',
          label: (ctx) => [
            ` Avg Intensity: ${ctx.parsed.x}`,
            ` Avg Likelihood: ${ctx.parsed.y}`,
            ` Bubble size = Avg Relevance`,
          ],
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f0f0f0' },
        ticks: { color: '#555', font: { size: 11 } },
        title: { display: true, text: 'Avg Intensity', color: '#888', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: { color: '#555', font: { size: 11 } },
        title: { display: true, text: 'Avg Likelihood', color: '#888', font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px' }}>
        Bubble size = Avg Relevance
      </p>
      <Bubble data={{ datasets }} options={options} />
    </div>
  );
}
