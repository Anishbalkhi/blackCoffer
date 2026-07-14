import React, { useState } from 'react';
import './index.css';
import { fetchInsightRecords, fetchFilterOptions, fetchAggregateMetrics } from './services/insightApi';
import { useInsightFilters } from './hooks/useInsightFilters';
import AppShell from './layout/AppShell';

export default function App() {
  const { activeFilters, activeFilterCount, setFilter, resetFilters } = useInsightFilters();

  const [insightRecords, setInsightRecords]       = useState([]);
  const [aggregateMetrics, setAggregateMetrics]   = useState(null);
  const [filterOptions, setFilterOptions]         = useState(null);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isStatsLoading, setIsStatsLoading]       = useState(true);
  const [errorMessage, setErrorMessage]           = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen]   = useState(false);

  React.useEffect(() => {
    fetchFilterOptions()
      .then((res) => setFilterOptions(res.filters))
      .catch((err) => console.log('Error loading filter options:', err));
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    setIsStatsLoading(true);
    setErrorMessage(null);

    fetchInsightRecords(activeFilters)
      .then((res) => setInsightRecords(res.data))
      .catch((err) => setErrorMessage(err.message || 'Could not reach the API. Is the server running on port 5000?'))
      .finally(() => setIsLoading(false));

    fetchAggregateMetrics(activeFilters)
      .then((res) => setAggregateMetrics(res.stats))
      .catch((err) => console.log('Error loading stats:', err))
      .finally(() => setIsStatsLoading(false));

  }, [activeFilters]);

  return (
    <AppShell
      insightRecords={insightRecords}
      aggregateMetrics={aggregateMetrics}
      activeFilters={activeFilters}
      filterOptions={filterOptions}
      isLoading={isLoading}
      isStatsLoading={isStatsLoading}
      errorMessage={errorMessage}
      filterDrawerOpen={filterDrawerOpen}
      activeFilterCount={activeFilterCount}
      onFilterChange={setFilter}
      onReset={resetFilters}
      onDrawerToggle={() => setFilterDrawerOpen(!filterDrawerOpen)}
    />
  );
}
