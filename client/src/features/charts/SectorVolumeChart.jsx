import React, { useMemo } from 'react';
import {
  Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, PolarAreaController,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, PolarAreaController);

const COLORS = [
  'rgba(30, 58, 95, 0.75)',
  'rgba(0, 121, 107, 0.75)',
  'rgba(230, 81, 0, 0.75)',
  'rgba(106, 27, 154, 0.75)',
  'rgba(21, 101, 192, 0.75)',
  'rgba(46, 125, 50, 0.75)',
  'rgba(198, 40, 40, 0.75)',
  'rgba(0, 96, 100, 0.75)',
  'rgba(74, 20, 140, 0.75)',
  'rgba(13, 71, 161, 0.75)',
  'rgba(1, 87, 155, 0.75)',
  'rgba(0, 77, 64, 0.75)',
];

export default function SectorVolumeChart({ insightRecords }) {
  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const sectorCount = {};
    insightRecords.forEach((record) => {
      const sector = record.sector || 'Other';
      sectorCount[sector] = (sectorCount[sector] || 0) + 1;
    });

    const sorted = Object.entries(sectorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map(([sector]) => sector),
      datasets: [{
        data: sorted.map(([, count]) => count),
        backgroundColor: COLORS.slice(0, sorted.length),
        borderColor: 'white',
        borderWidth: 2,
      }],
    };
  }, [insightRecords]);

  if (!chartData) {
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
        labels: { color: '#333', font: { size: 10 }, boxWidth: 12, padding: 8 },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e3a5f',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        grid: { color: '#e8e8e8' },
        ticks: { color: '#888', backdropColor: 'transparent', font: { size: 9 } },
      },
    },
  };

  return <PolarArea data={chartData} options={options} />;
}
