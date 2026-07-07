import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PolarAreaController,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, PolarAreaController);

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
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(40, 159, 64, 0.6)',
          'rgba(210, 99, 132, 0.6)',
          'rgba(54, 80, 235, 0.6)',
          'rgba(255, 50, 86, 0.6)',
        ],
        borderWidth: 1,
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
        labels: { font: { size: 10 }, boxWidth: 10 },
      },
    },
  };

  return <PolarArea data={chartData} options={options} />;
}
