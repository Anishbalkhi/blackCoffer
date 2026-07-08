import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function YearlyLikelihoodTrend({ insightRecords }) {
  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const yearMap = {};
    insightRecords.forEach((record) => {
      if (record.start_year == null || record.likelihood == null) return;
      const year = Number(record.start_year);
      if (isNaN(year) || year < 2000 || year > 2035) return;
      if (!yearMap[year]) yearMap[year] = { total: 0, count: 0 };
      yearMap[year].total += record.likelihood;
      yearMap[year].count += 1;
    });

    const years = Object.keys(yearMap).map(Number).sort((a, b) => a - b);
    if (years.length === 0) return null;

    return {
      labels: years.map(String),
      datasets: [{
        label: 'Avg Likelihood',
        data: years.map((yr) => parseFloat((yearMap[yr].total / yearMap[yr].count).toFixed(2))),
        borderColor: '#1e3a5f',
        backgroundColor: 'rgba(30, 58, 95, 0.08)',
        pointBackgroundColor: '#1e3a5f',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.3,
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
      legend: { labels: { color: '#555', font: { size: 11 } } },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e3a5f',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: '#f0f0f0' },
        ticks: { color: '#555', font: { size: 11 } },
        title: { display: true, text: 'Year', color: '#888', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: { color: '#555', font: { size: 11 } },
        title: { display: true, text: 'Avg Likelihood', color: '#888', font: { size: 11 } },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
