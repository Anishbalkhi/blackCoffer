import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SWOT_COLORS = {
  S: 'rgba(16, 185, 129, 0.8)',   // emerald - Strengths
  W: 'rgba(244, 63, 94, 0.8)',    // rose    - Weaknesses
  O: 'rgba(99, 102, 241, 0.8)',   // indigo  - Opportunities
  T: 'rgba(245, 158, 11, 0.8)',   // amber   - Threats
  '': 'rgba(148, 163, 184, 0.6)', // muted   - Unspecified
};

export default function SectorBreakdown({ data }) {
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    // Group by sector
    const sectorMap = {};
    data.forEach(({ sector }) => {
      const key = sector || 'Other';
      sectorMap[key] = (sectorMap[key] || 0) + 1;
    });

    const sorted = Object.entries(sectorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map(([s]) => s || 'Other'),
      datasets: [{
        label: 'Records',
        data: sorted.map(([, count]) => count),
        backgroundColor: sorted.map((_, i) =>
          `hsla(${260 + i * 12}, 75%, 62%, 0.8)`
        ),
        borderColor: sorted.map((_, i) =>
          `hsla(${260 + i * 12}, 75%, 62%, 1)`
        ),
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }, [data]);

  if (!chartData) return (
    <div className="no-data">
      <div className="no-data-icon">📭</div>
      <p>No data for current filters</p>
    </div>
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` Records: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxRotation: 35,
        },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: 'Number of Records', color: '#5a6a8a', font: { size: 11 } },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
