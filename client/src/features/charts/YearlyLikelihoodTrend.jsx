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
        borderColor: '#4a90d9',
        backgroundColor: 'rgba(74, 144, 217, 0.1)',
        pointBackgroundColor: '#4a90d9',
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
      legend: { display: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Year' },
      },
      y: {
        title: { display: true, text: 'Avg Likelihood' },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
