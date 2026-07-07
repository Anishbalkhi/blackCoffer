import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchInsightRecords, fetchFilterOptions, fetchAggregateMetrics } from './services/insightApi';
import { useInsightFilters } from './hooks/useInsightFilters';
import AppShell from './layout/AppShell';

export default function App() {
  const { activeFilters, activeFilterCount, setFilter, resetFilters } = useInsightFilters();

  const [insightRecords, setInsightRecords] = useState([]);
  const [aggregateMetrics, setAggregateMetrics] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchFilterOptions()
      .then((res) => setFilterOptions(res.filters))
      .catch((err) => console.log('error loading filter options:', err));
  }, []);

  const filtersSignature = JSON.stringify(activeFilters);

  useEffect(() => {
    setIsLoading(true);
    setIsStatsLoading(true);
    setErrorMessage(null);

    Promise.all([
      fetchInsightRecords(activeFilters),
      fetchAggregateMetrics(activeFilters),
    ])
      .then(([recordsResponse, metricsResponse]) => {
        setInsightRecords(recordsResponse.data);
        setAggregateMetrics(metricsResponse.stats);
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Could not reach the API. Is the server running on port 5000?');
      })
      .finally(() => {
        setIsLoading(false);
        setIsStatsLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersSignature]);

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
