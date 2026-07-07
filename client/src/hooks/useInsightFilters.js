import { useState } from 'react';

const defaultFilters = {
  endYear: null,
  topic: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  swot: [],
  country: [],
  city: [],
};

export const useInsightFilters = () => {
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  function setFilter(field, value) {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetFilters() {
    setActiveFilters({ ...defaultFilters });
  }

  let activeFilterCount = 0;
  if (activeFilters.endYear) activeFilterCount += 1;
  if (activeFilters.topic && activeFilters.topic.length > 0) activeFilterCount += 1;
  if (activeFilters.sector && activeFilters.sector.length > 0) activeFilterCount += 1;
  if (activeFilters.region && activeFilters.region.length > 0) activeFilterCount += 1;
  if (activeFilters.pestle && activeFilters.pestle.length > 0) activeFilterCount += 1;
  if (activeFilters.source && activeFilters.source.length > 0) activeFilterCount += 1;
  if (activeFilters.country && activeFilters.country.length > 0) activeFilterCount += 1;

  return { activeFilters, activeFilterCount, setFilter, resetFilters };
};
