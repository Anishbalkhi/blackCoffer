import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const http = axios.create({ baseURL: BASE_URL });

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.endYear)                           params.set('endYear',  filters.endYear);
  if (filters.topic   && filters.topic.length)   params.set('topic',    filters.topic.join(','));
  if (filters.sector  && filters.sector.length)  params.set('sector',   filters.sector.join(','));
  if (filters.region  && filters.region.length)  params.set('region',   filters.region.join(','));
  if (filters.pestle  && filters.pestle.length)  params.set('pestle',   filters.pestle.join(','));
  if (filters.source  && filters.source.length)  params.set('source',   filters.source.join(','));
  if (filters.swot    && filters.swot.length)    params.set('swot',     filters.swot.join(','));
  if (filters.country && filters.country.length) params.set('country',  filters.country.join(','));
  if (filters.city    && filters.city.length)    params.set('city',     filters.city.join(','));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const fetchInsightRecords = (filters) =>
  http.get(`/data${buildQueryString(filters)}`).then((response) => response.data);

export const fetchFilterOptions = () =>
  http.get('/filters').then((response) => response.data);

export const fetchAggregateMetrics = (filters) =>
  http.get(`/stats${buildQueryString(filters)}`).then((response) => response.data);
