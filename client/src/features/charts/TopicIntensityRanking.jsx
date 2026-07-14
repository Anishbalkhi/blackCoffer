import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopicIntensityRanking({ insightRecords }) {

  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const topicMap = {};
    insightRecords.forEach((record) => {
      if (!record.topic || record.intensity == null) return;

      if (!topicMap[record.topic]) {
        topicMap[record.topic] = { total: 0, count: 0 };
      }
      topicMap[record.topic].total += record.intensity;
      topicMap[record.topic].count += 1;
    });

    const sorted = Object.entries(topicMap)
      .map(([topic, data]) => ({
        topic,
        avg: data.total / data.count,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map((d) => d.topic),
      datasets: [{
        label: 'Avg Intensity',
        data: sorted.map((d) => parseFloat(d.avg.toFixed(2))),
        backgroundColor: 'rgba(30, 58, 95, 0.75)',
        borderColor: 'rgba(30, 58, 95, 1)',
        borderWidth: 1,
        borderRadius: 3,
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
        title: { display: true, text: 'Average Intensity', color: '#888', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#333', font: { size: 11 } },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
