import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

/**
 * Build a query string from the filters object.
 * Arrays become comma-separated values.
 */
const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else {
      params.set(key, value);
    }
  });
  return params.toString();
};

export const fetchData = async (filters = {}) => {
  const qs = buildQueryString(filters);
  const { data } = await api.get(`/data${qs ? `?${qs}` : ''}`);
  return data;
};

export const fetchFilterOptions = async () => {
  const { data } = await api.get('/filters');
  return data;
};

export const fetchStats = async (filters = {}) => {
  const qs = buildQueryString(filters);
  const { data } = await api.get(`/stats${qs ? `?${qs}` : ''}`);
  return data;
};

export default api;
