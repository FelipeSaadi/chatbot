// Usar URL relativa em produção, absoluta em desenvolvimento
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const API_BASE = isProduction ? '/api' : (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api');

// Helper para construir URLs com query params
function buildUrl(path: string, params: Record<string, any> = {}) {
  const url = `${API_BASE}${path}`;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

export async function fetchTotalByService(filters = {}) {
  const url = buildUrl('/dashboard/total-by-service', filters);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch totalByService');
  return res.json();
}

export async function fetchServiceRanking(params: { limit?: number } = {}) {
  const url = buildUrl('/dashboard/service-ranking', params);
  const res = await fetch(url);
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
  const url = buildUrl('/dashboard/response-time', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch responseTime');
  return res.json();
}
