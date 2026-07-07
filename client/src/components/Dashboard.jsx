import React from 'react';
import SummaryCards from './SummaryCards';
import FilterBar from './FilterBar';
import IntensityByTopic from './charts/IntensityByTopic';
import LikelihoodByYear from './charts/LikelihoodByYear';
import RelevanceByRegion from './charts/RelevanceByRegion';
import CountryDistribution from './charts/CountryDistribution';
import SectorBreakdown from './charts/SectorBreakdown';
import IntensityHeatmap from './charts/IntensityHeatmap';

const ChartCard = ({ title, subtitle, badge, children, className = '', tall = false, fullWidth = false }) => (
  <div className={`chart-card${fullWidth ? ' full-width' : ''} ${className}`}>
    <div className="chart-card-header">
      <div>
        <div className="chart-title">{title}</div>
        {subtitle && <div className="chart-subtitle">{subtitle}</div>}
      </div>
      {badge && <span className="chart-badge">{badge}</span>}
    </div>
    <div className={`chart-body${tall ? ' tall' : ''}`}>
      {children}
    </div>
  </div>
);

export default function Dashboard({
  data, stats, filters, filterOptions, loading, statsLoading, error,
  theme, sidebarOpen, onFilterChange, onReset, onThemeToggle, onSidebarToggle,
}) {
  if (error) {
    return (
      <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle-btn" onClick={onSidebarToggle} title="Toggle sidebar">☰</button>
            <a className="topbar-logo" href="/">
              <div className="logo-icon">📊</div>
              <span className="logo-text">Blackcoffer</span>
            </a>
          </div>
          <div className="topbar-right">
            <div className="status-dot" style={{ background: '#f43f5e', boxShadow: '0 0 6px #f43f5e' }} />
            <button className="theme-toggle" onClick={onThemeToggle}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>
        <div className="error-state" style={{ gridColumn: '1 / -1' }}>
          <div className="error-icon">⚠️</div>
          <div className="error-title">API Unreachable</div>
          <p className="error-msg">{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-layout${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      {/* ===== TOP BAR ===== */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="sidebar-toggle-btn" onClick={onSidebarToggle} title="Toggle filters sidebar">
            ☰
          </button>
          <a className="topbar-logo" href="/">
            <div className="logo-icon">📊</div>
            <span className="logo-text">Blackcoffer Analytics</span>
          </a>
        </div>
        <div className="topbar-right">
          {loading ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⟳ Fetching data...</div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {data.length.toLocaleString()} records
            </div>
          )}
          <div className="status-dot" />
          <button className="theme-toggle" onClick={onThemeToggle}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={onFilterChange}
          onReset={onReset}
        />
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Business Insights Dashboard</h1>
          <p className="page-subtitle">
            Explore global business data across sectors, regions, topics and more
          </p>
        </div>

        {/* KPI Summary Cards */}
        <SummaryCards stats={stats} loading={statsLoading} />

        {/* Chart Grid */}
        <div className="chart-grid">
          <ChartCard
            title="Intensity by Topic"
            subtitle="Top 10 topics by average intensity"
            badge="Top 10"
            tall
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <IntensityByTopic data={data} />
            }
          </ChartCard>

          <ChartCard
            title="Likelihood Over Time"
            subtitle="Average likelihood score by start year"
            badge="Line"
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <LikelihoodByYear data={data} />
            }
          </ChartCard>

          <ChartCard
            title="Relevance by Region"
            subtitle="Average relevance score per world region"
            badge="Donut"
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <RelevanceByRegion data={data} />
            }
          </ChartCard>

          <ChartCard
            title="Sector Breakdown"
            subtitle="Record count per business sector"
            badge="Bar"
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <SectorBreakdown data={data} />
            }
          </ChartCard>

          <ChartCard
            title="Country Distribution"
            subtitle="Top 15 countries by record count"
            badge="Top 15"
            tall
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <CountryDistribution data={data} />
            }
          </ChartCard>

          <ChartCard
            title="Intensity Heatmap"
            subtitle="Avg intensity: Topic × Likelihood (D3)"
            badge="D3"
            fullWidth
            className="heatmap-card"
          >
            {loading
              ? <div className="chart-loading"><div className="spinner" /></div>
              : <IntensityHeatmap data={data} />
            }
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
