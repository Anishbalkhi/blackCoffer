import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const http = axios.create({ baseURL: BASE });

const toQueryString = (activeFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(activeFilters).forEach(([key, val]) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return;
    params.set(key, Array.isArray(val) ? val.join(',') : val);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

export const fetchInsightRecords = (activeFilters) =>
  http.get(`/data${toQueryString(activeFilters)}`).then((r) => r.data);

export const fetchFilterOptions = () =>
  http.get('/filters').then((r) => r.data);

export const fetchAggregateMetrics = (activeFilters) =>
  http.get(`/stats${toQueryString(activeFilters)}`).then((r) => r.data);
