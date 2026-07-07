import React from 'react';

const cards = [
  { key: 'total', label: 'Total Records', icon: '📊', color: 'indigo', format: (v) => v?.toLocaleString() ?? '—', sub: 'matching insights' },
  { key: 'avgIntensity', label: 'Avg Intensity', icon: '⚡', color: 'amber', format: (v) => v?.toFixed(2) ?? '—', sub: 'out of max scale' },
  { key: 'avgLikelihood', label: 'Avg Likelihood', icon: '🎯', color: 'cyan', format: (v) => v?.toFixed(2) ?? '—', sub: 'probability score' },
  { key: 'avgRelevance', label: 'Avg Relevance', icon: '🔗', color: 'emerald', format: (v) => v?.toFixed(2) ?? '—', sub: 'relevance score' },
  { key: 'distinctCountries', label: 'Countries', icon: '🌍', color: 'violet', format: (v) => v ?? '—', sub: 'distinct nations' },
  { key: 'distinctTopics', label: 'Topics', icon: '💡', color: 'rose', format: (v) => v ?? '—', sub: 'unique topics' },
];

export default function SummaryCards({ stats, loading }) {
  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div key={card.key} className={`kpi-card${loading ? ' loading' : ''}`}>
          <div className={`kpi-icon ${card.color}`}>{card.icon}</div>
          <div className="kpi-body">
            {loading ? (
              <>
                <div className="skeleton kpi-label" />
                <div className="skeleton kpi-value" />
              </>
            ) : (
              <>
                <div className="kpi-label">{card.label}</div>
                <div className="kpi-value">{card.format(stats?.[card.key])}</div>
                <div className="kpi-sub">{card.sub}</div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
