import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function IntensityByTopic({ data }) {
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    const map = {};
    data.forEach(({ topic, intensity }) => {
      if (!topic || intensity == null) return;
      if (!map[topic]) map[topic] = { sum: 0, count: 0 };
      map[topic].sum += intensity;
      map[topic].count++;
    });

    const sorted = Object.entries(map)
      .map(([topic, { sum, count }]) => ({ topic, avg: sum / count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);

    return {
      labels: sorted.map((d) => d.topic),
      datasets: [{
        label: 'Avg Intensity',
        data: sorted.map((d) => parseFloat(d.avg.toFixed(2))),
        backgroundColor: sorted.map((_, i) =>
          `hsla(${250 - i * 15}, 80%, 65%, 0.8)`
        ),
        borderColor: sorted.map((_, i) =>
          `hsla(${250 - i * 15}, 80%, 65%, 1)`
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
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` Avg Intensity: ${ctx.parsed.x}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: 'Average Intensity', color: '#5a6a8a', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
