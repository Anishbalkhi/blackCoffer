import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function LikelihoodByYear({ data }) {
  const chartData = useMemo(() => {
    if (!data?.length) return null;

    const map = {};
    data.forEach(({ start_year, likelihood }) => {
      if (!start_year || likelihood == null) return;
      const year = Number(start_year);
      if (isNaN(year) || year < 2000 || year > 2040) return;
      if (!map[year]) map[year] = { sum: 0, count: 0 };
      map[year].sum += likelihood;
      map[year].count++;
    });

    const years = Object.keys(map).map(Number).sort((a, b) => a - b);
    if (years.length === 0) return null;

    return {
      labels: years.map(String),
      datasets: [{
        label: 'Avg Likelihood',
        data: years.map((y) => parseFloat((map[y].sum / map[y].count).toFixed(2))),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
      }],
    };
  }, [data]);

  if (!chartData) return (
    <div className="no-data">
      <div className="no-data-icon">📭</div>
      <p>No data with valid start years for current filters</p>
    </div>
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 15, 30, 0.95)',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: 'Start Year', color: '#5a6a8a', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        title: { display: true, text: 'Avg Likelihood', color: '#5a6a8a', font: { size: 11 } },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
