export interface DashboardStatsDTO {
  windowDays: number;
  totalEntriesInWindow: number;
  averagePainSeverity: number;
  averageDurationMinutes: number;
  monthlyFrequency: number;
  weeklyFrequency: number;
  severityBreakdown: {
    mild: number;
    moderate: number;
    severe: number;
    debilitating: number;
  };
  monthlyTrends: Array<{
    month: string;
    label: string;
    count: number;
    avgPain: number;
  }>;
  recentTrends: Array<{
    date: string;
    painSeverity: number;
    durationMinutes: number;
  }>;
}

export type StatCardVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
