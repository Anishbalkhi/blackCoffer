import React, { useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CountryDistribution({ data }) {
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    const map = {};
    data.forEach(({ country }) => {
      const key = country || 'Unspecified';
      map[key] = (map[key] || 0) + 1;
    });

    const sorted = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map(([c]) => c),
      datasets: [{
        label: 'Record Count',
        data: sorted.map(([, count]) => count),
        backgroundColor: sorted.map((_, i) =>
          `hsla(${190 + i * 8}, 75%, 58%, 0.8)`
        ),
        borderColor: sorted.map((_, i) =>
          `hsla(${190 + i * 8}, 75%, 58%, 1)`
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
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` Records: ${ctx.parsed.x}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: 'Number of Records', color: '#5a6a8a', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 15 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
