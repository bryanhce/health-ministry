import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';
import { DynamoDBHeadacheRepository } from '@/backend/headache/repository/DynamoDBHeadacheRepository';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';

export interface DashboardStatsResult {
  windowDays: number;
  totalEntriesInWindow: number;
  averagePainSeverity: number;
  averageDurationMinutes: number;
  monthlyFrequency: number; // Episodes per month
  weeklyFrequency: number; // Episodes per week
  severityBreakdown: {
    mild: number; // 1-3
    moderate: number; // 4-6
    severe: number; // 7-8
    debilitating: number; // 9-10
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

const DASHBOARD_CONSTANTS = {
  THREE_MONTH_DAYS: 90,
  DAYS_IN_WEEK: 7,
  DAYS_IN_MONTH: 30,
  PAIN_THRESHOLDS: {
    MILD_MAX: 3,
    MODERATE_MAX: 6,
    SEVERE_MAX: 8,
  },
} as const;

export class DashboardService {
  private repository: IHeadacheRepository;

  constructor(repository?: IHeadacheRepository) {
    this.repository = repository ?? new DynamoDBHeadacheRepository();
  }

  async getDashboardStats(): Promise<DashboardStatsResult> {
    const allEntries = await this.repository.findAll();

    const now = new Date();
    const windowStart = new Date(now);
    windowStart.setDate(now.getDate() - DASHBOARD_CONSTANTS.THREE_MONTH_DAYS);
    const windowStartString = windowStart.toISOString().split('T')[0];

    const windowEntries = allEntries.filter((entry) => entry.date >= windowStartString);

    if (windowEntries.length === 0) {
      return this.buildEmptyStats();
    }

    const totalPain = windowEntries.reduce((sum, e) => sum + e.painSeverity, 0);
    const totalDuration = windowEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
    const avgPain = Math.round((totalPain / windowEntries.length) * 10) / 10;
    const avgDuration = Math.round(totalDuration / windowEntries.length);

    const weeksInPeriod = DASHBOARD_CONSTANTS.THREE_MONTH_DAYS / DASHBOARD_CONSTANTS.DAYS_IN_WEEK;
    const monthsInPeriod = DASHBOARD_CONSTANTS.THREE_MONTH_DAYS / DASHBOARD_CONSTANTS.DAYS_IN_MONTH;

    const weeklyFreq = Math.round((windowEntries.length / weeksInPeriod) * 10) / 10;
    const monthlyFreq = Math.round((windowEntries.length / monthsInPeriod) * 10) / 10;

    const breakdown = {
      mild: 0,
      moderate: 0,
      severe: 0,
      debilitating: 0,
    };

    for (const entry of windowEntries) {
      if (entry.painSeverity <= DASHBOARD_CONSTANTS.PAIN_THRESHOLDS.MILD_MAX) {
        breakdown.mild += 1;
      } else if (entry.painSeverity <= DASHBOARD_CONSTANTS.PAIN_THRESHOLDS.MODERATE_MAX) {
        breakdown.moderate += 1;
      } else if (entry.painSeverity <= DASHBOARD_CONSTANTS.PAIN_THRESHOLDS.SEVERE_MAX) {
        breakdown.severe += 1;
      } else {
        breakdown.debilitating += 1;
      }
    }

    const monthlyTrends = this.calculateMonthlyTrends(allEntries);
    const recentTrends = this.calculateRecentTrends(allEntries);

    return {
      windowDays: DASHBOARD_CONSTANTS.THREE_MONTH_DAYS,
      totalEntriesInWindow: windowEntries.length,
      averagePainSeverity: avgPain,
      averageDurationMinutes: avgDuration,
      monthlyFrequency: monthlyFreq,
      weeklyFrequency: weeklyFreq,
      severityBreakdown: breakdown,
      monthlyTrends,
      recentTrends,
    };
  }

  private buildEmptyStats(): DashboardStatsResult {
    return {
      windowDays: DASHBOARD_CONSTANTS.THREE_MONTH_DAYS,
      totalEntriesInWindow: 0,
      averagePainSeverity: 0,
      averageDurationMinutes: 0,
      monthlyFrequency: 0,
      weeklyFrequency: 0,
      severityBreakdown: { mild: 0, moderate: 0, severe: 0, debilitating: 0 },
      monthlyTrends: [],
      recentTrends: [],
    };
  }

  private calculateMonthlyTrends(entries: HeadacheEntry[]): Array<{
    month: string;
    label: string;
    count: number;
    avgPain: number;
  }> {
    const monthlyMap = new Map<string, { count: number; totalPain: number }>();

    // Prepare last 4 months
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, { count: 0, totalPain: 0 });
    }

    for (const entry of entries) {
      const monthKey = entry.date.substring(0, 7); // "YYYY-MM"
      if (monthlyMap.has(monthKey)) {
        const item = monthlyMap.get(monthKey)!;
        item.count += 1;
        item.totalPain += entry.painSeverity;
      }
    }

    return Array.from(monthlyMap.entries()).map(([month, data]) => {
      const [year, m] = month.split('-');
      const dateObj = new Date(Number(year), Number(m) - 1, 1);
      const label = dateObj.toLocaleDateString('en-US', { month: 'short' });

      return {
        month,
        label,
        count: data.count,
        avgPain: data.count > 0 ? Math.round((data.totalPain / data.count) * 10) / 10 : 0,
      };
    });
  }

  private calculateRecentTrends(entries: HeadacheEntry[]): Array<{
    date: string;
    painSeverity: number;
    durationMinutes: number;
  }> {
    // Return the latest 15 entries sorted by date ascending for trend visualization
    return [...entries]
      .slice(0, 15)
      .reverse()
      .map((entry) => ({
        date: entry.date,
        painSeverity: entry.painSeverity,
        durationMinutes: entry.durationMinutes,
      }));
  }
}
