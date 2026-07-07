import React from 'react';
import MetricsSummary from '../features/overview/MetricsSummary';
import FilterPanel from '../features/filters/FilterPanel';
import TopicIntensityRanking from '../features/charts/TopicIntensityRanking';
import YearlyLikelihoodTrend from '../features/charts/YearlyLikelihoodTrend';
import RegionRelevanceRadar from '../features/charts/RegionRelevanceRadar';
import CountryFrequencyMap from '../features/charts/CountryFrequencyMap';
import SectorVolumeChart from '../features/charts/SectorVolumeChart';
import InsightDensityHeatmap from '../features/charts/InsightDensityHeatmap';
import MetricCorrelationBubble from '../features/charts/MetricCorrelationBubble';

function ChartPanel({ title, subtitle, badge, badgeVariant = '', children, span = 1, tall = false, featured = false }) {
  let spanClass = '';
  if (span === 2) spanClass = ' span-2';
  if (span === 3) spanClass = ' span-3';

  return (
    <div className={'chart-card' + (featured ? ' featured' : '') + spanClass}>
      <div className="chart-card-header">
        <div>
          <div className="chart-title">{title}</div>
          {subtitle && <div className="chart-subtitle">{subtitle}</div>}
        </div>
        {badge && <span className={'chart-type-badge ' + badgeVariant}>{badge}</span>}
      </div>
      <div className={'chart-body' + (tall ? ' tall' : '')}>{children}</div>
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="chart-spinner">
      <div className="spinner"></div>
    </div>
  );
}

export default function AppShell({
  insightRecords,
  aggregateMetrics,
  activeFilters,
  filterOptions,
  isLoading,
  isStatsLoading,
  errorMessage,
  filterDrawerOpen,
  activeFilterCount,
  onFilterChange,
  onReset,
  onDrawerToggle,
}) {
  if (errorMessage) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <a className="topbar-brand" href="/">
            <span>📊</span>
            <span className="brand-name">Insight Dashboard</span>
          </a>
        </header>
        <div className="error-screen">
          <div className="error-screen-icon">⚠️</div>
          <div className="error-screen-title">Error: API Not Reachable</div>
          <p className="error-screen-msg">{errorMessage}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="topbar-brand" href="/">
          <span>📊</span>
          <span className="brand-name">Insight Dashboard</span>
        </a>

        <div className="topbar-actions">
          {!isLoading && (
            <span className="record-count-pill">
              {insightRecords.length} records
            </span>
          )}
          <div className="live-dot" title="connected"></div>
          <button
            className={'icon-btn filter-toggle-btn' + (filterDrawerOpen ? ' active' : '')}
            onClick={onDrawerToggle}
          >
            Filters
            {activeFilterCount > 0 && (
              <span style={{ marginLeft: '4px', background: 'white', color: '#2c3e6b', borderRadius: '10px', padding: '1px 6px', fontSize: '12px', fontWeight: 'bold' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <FilterPanel
        isOpen={filterDrawerOpen}
        onClose={onDrawerToggle}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        activeFilterCount={activeFilterCount}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />

      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Business Insight Dashboard</h1>
          <p className="page-subtitle">
            View data on sectors, regions, topics and trends
          </p>
        </div>

        <MetricsSummary aggregateMetrics={aggregateMetrics} isLoading={isStatsLoading} />

        <div className="chart-grid">

          <ChartPanel
            title="Topic Intensity Ranking"
            subtitle="Top 10 topics by average intensity"
            badge="Bar Chart"
            tall
          >
            {isLoading ? <LoadingPlaceholder /> : <TopicIntensityRanking insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Likelihood Over Time"
            subtitle="Average likelihood by start year"
            badge="Line Chart"
            badgeVariant="amber"
          >
            {isLoading ? <LoadingPlaceholder /> : <YearlyLikelihoodTrend insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Region Relevance"
            subtitle="Average relevance per region"
            badge="Radar"
            badgeVariant="teal"
          >
            {isLoading ? <LoadingPlaceholder /> : <RegionRelevanceRadar insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Country Frequency"
            subtitle="Top 15 countries by number of records"
            badge="Bar Chart"
            tall
          >
            {isLoading ? <LoadingPlaceholder /> : <CountryFrequencyMap insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Sector Breakdown"
            subtitle="Records per business sector"
            badge="Polar Area"
            badgeVariant="lav"
            tall
          >
            {isLoading ? <LoadingPlaceholder /> : <SectorVolumeChart insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Intensity vs Likelihood vs Relevance"
            subtitle="Each bubble = one sector"
            badge="Bubble Chart"
            badgeVariant="amber"
            span={3}
            featured
          >
            {isLoading ? <LoadingPlaceholder /> : <MetricCorrelationBubble insightRecords={insightRecords} />}
          </ChartPanel>

          <ChartPanel
            title="Insight Density Heatmap"
            subtitle="Intensity per topic vs likelihood bucket"
            badge="Heatmap"
            badgeVariant="teal"
            span={3}
          >
            <div className="chart-body xtall">
              {isLoading ? <LoadingPlaceholder /> : <InsightDensityHeatmap insightRecords={insightRecords} />}
            </div>
          </ChartPanel>

        </div>
      </main>
    </div>
  );
}
