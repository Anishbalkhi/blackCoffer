import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RegionRelevanceRadar({ insightRecords }) {
  const chartData = useMemo(() => {
    if (!insightRecords || insightRecords.length === 0) return null;

    const regionMap = {};
    insightRecords.forEach((record) => {
      const region = record.region || 'Unknown';
      if (record.relevance == null) return;
      if (!regionMap[region]) regionMap[region] = { total: 0, count: 0 };
      regionMap[region].total += record.relevance;
      regionMap[region].count += 1;
    });

    const sorted = Object.entries(regionMap)
      .map(([region, data]) => ({ region, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8);

    if (sorted.length === 0) return null;

    return {
      labels: sorted.map((d) => d.region),
      datasets: [{
        label: 'Avg Relevance',
        data: sorted.map((d) => parseFloat(d.avg.toFixed(2))),
        backgroundColor: 'rgba(74, 144, 217, 0.2)',
        borderColor: '#4a90d9',
        pointBackgroundColor: '#4a90d9',
        borderWidth: 2,
        fill: true,
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
  };

  return <Radar data={chartData} options={options} />;
}
