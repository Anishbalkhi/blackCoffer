import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CountryFrequencyMap({ insightRecords }) {
  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    // count records per country
    const countryCount = {};
    insightRecords.forEach((record) => {
      const country = record.country || 'Unknown';
      countryCount[country] = (countryCount[country] || 0) + 1;
    });

    const sorted = Object.entries(countryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map(([country]) => country),
      datasets: [{
        label: 'Records',
        data: sorted.map(([, count]) => count),
        backgroundColor: 'rgba(82, 183, 136, 0.7)',
        borderColor: 'rgba(82, 183, 136, 1)',
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
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Number of Records' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
