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

// colors for different sectors
const COLORS = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(199, 50, 132, 0.7)',
  'rgba(54, 80, 235, 0.7)',
  'rgba(40, 180, 80, 0.7)',
  'rgba(255, 80, 50, 0.7)',
  'rgba(100, 200, 200, 0.7)',
  'rgba(180, 100, 255, 0.7)',
];

export default function MetricCorrelationBubble({ insightRecords }) {
  const datasets = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    // group by sector
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
      borderColor: COLORS[index % COLORS.length].replace('0.7', '1'),
      borderWidth: 1,
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
        labels: { font: { size: 10 }, boxWidth: 10 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Avg Intensity' },
      },
      y: {
        title: { display: true, text: 'Avg Likelihood' },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
        * Bubble size = Avg Relevance
      </p>
      <Bubble data={{ datasets }} options={options} />
    </div>
  );
}
