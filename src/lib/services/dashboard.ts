// Usar URL relativa em produção, absoluta em desenvolvimento
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE = isProduction ? '/api' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api');

export async function fetchTotalByService(filters = {}) {
  const url = new URL(`${API_BASE}/dashboard/total-by-service`);
  Object.entries(filters).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch totalByService');
  return res.json();
}

export async function fetchServiceRanking(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE}/dashboard/service-ranking`);
  if (params.limit) url.searchParams.set('limit', String(params.limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch serviceRanking');
  return res.json();
}

export async function fetchDepartmentStats() {
  const url = `${API_BASE}/dashboard/department-stats`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch departmentStats');
  return res.json();
}

export async function fetchRegionProfiles() {
  const url = `${API_BASE}/dashboard/region-profiles`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch regionProfiles');
  return res.json();
}

export async function fetchResponseTime(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE}/dashboard/response-time`);
  if (params.limit) url.searchParams.set('limit', String(params.limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch responseTime');
  return res.json();
}
