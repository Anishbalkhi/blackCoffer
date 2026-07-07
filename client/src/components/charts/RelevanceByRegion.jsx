import React, { useMemo } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#f43f5e', '#0ea5e9', '#a78bfa',
  '#34d399', '#fbbf24', '#fb7185', '#38bdf8',
];

export default function RelevanceByRegion({ data }) {
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    const map = {};
    data.forEach(({ region, relevance }) => {
      const key = region || 'Unspecified';
      if (relevance == null) return;
      if (!map[key]) map[key] = { sum: 0, count: 0 };
      map[key].sum += relevance;
      map[key].count++;
    });

    const sorted = Object.entries(map)
      .map(([region, { sum, count }]) => ({ region, avg: sum / count }))
      .sort((a, b) => b.avg - a.avg);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map((d) => d.region),
      datasets: [{
        data: sorted.map((d) => parseFloat(d.avg.toFixed(2))),
        backgroundColor: sorted.map((_, i) => COLORS[i % COLORS.length] + 'cc'),
        borderColor: sorted.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 2,
        hoverOffset: 8,
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
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
          padding: 12,
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` Avg Relevance: ${ctx.parsed}`,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
