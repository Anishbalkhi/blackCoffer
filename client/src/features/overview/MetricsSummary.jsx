import React from 'react';

export default function MetricsSummary({ aggregateMetrics, isLoading }) {
  return (
    <div className="metrics-grid">

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">📋</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Total Records</div>
              <div className="metric-value">{aggregateMetrics?.total ?? '—'}</div>
              <div className="metric-sub">matching insights</div>
            </>
          )}
        </div>
      </div>

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">⚡</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Avg Intensity</div>
              <div className="metric-value">{aggregateMetrics?.avgIntensity?.toFixed(2) ?? '—'}</div>
              <div className="metric-sub">mean intensity score</div>
            </>
          )}
        </div>
      </div>

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">🎯</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Avg Likelihood</div>
              <div className="metric-value">{aggregateMetrics?.avgLikelihood?.toFixed(2) ?? '—'}</div>
              <div className="metric-sub">probability rating</div>
            </>
          )}
        </div>
      </div>

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">🔗</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Avg Relevance</div>
              <div className="metric-value">{aggregateMetrics?.avgRelevance?.toFixed(2) ?? '—'}</div>
              <div className="metric-sub">relevance score</div>
            </>
          )}
        </div>
      </div>

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">🌍</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Countries</div>
              <div className="metric-value">{aggregateMetrics?.distinctCountries ?? '—'}</div>
              <div className="metric-sub">nations represented</div>
            </>
          )}
        </div>
      </div>

      <div className={'metric-card' + (isLoading ? ' loading' : '')}>
        <div className="metric-icon-wrap">💡</div>
        <div className="metric-body">
          {isLoading ? (
            <>
              <div className="skeleton metric-label"></div>
              <div className="skeleton metric-value"></div>
            </>
          ) : (
            <>
              <div className="metric-label">Topics</div>
              <div className="metric-value">{aggregateMetrics?.distinctTopics ?? '—'}</div>
              <div className="metric-sub">unique topic areas</div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
