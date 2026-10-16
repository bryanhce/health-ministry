import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/frontend/api/dashboardApi';
import { DashboardStatsDTO } from '@/frontend/domain/dashboard.types';

export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, 'stats'] as const,
} as const;

export function useDashboardStats() {
  const statsQuery = useQuery<DashboardStatsDTO, Error>({
    queryKey: DASHBOARD_QUERY_KEYS.stats(),
    queryFn: fetchDashboardStats,
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
}
