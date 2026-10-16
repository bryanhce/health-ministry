import { DashboardStatsDTO } from '@/frontend/domain/dashboard.types';
import { ApiError } from '@/frontend/api/headacheApi';

const DASHBOARD_ENDPOINTS = {
  STATS: '/api/dashboard/stats',
} as const;

export async function fetchDashboardStats(): Promise<DashboardStatsDTO> {
  const res = await fetch(DASHBOARD_ENDPOINTS.STATS, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    let errorMessage = `Failed to fetch dashboard stats (${res.status})`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) {
        errorMessage = errorJson.error.message || errorMessage;
      }
    } catch {
      // response wasn't JSON
    }
    throw new ApiError(errorMessage, res.status);
  }

  const json = await res.json();
  return json.data;
}
