import React from 'react';
import { DashboardStatsDTO } from '@/frontend/domain/dashboard.types';
import { StatCard } from '@/frontend/components/dashboard/StatCard';
import { PainBadge } from '@/frontend/components/ui/Badge';
import { formatDuration } from '@/frontend/utils/formatters';
import { Activity, Calendar, Clock, Flame } from 'lucide-react';

export interface DashboardStatsProps {
  stats?: DashboardStatsDTO;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const avgPain = stats?.averagePainSeverity ?? 0;
  const avgDuration = stats?.averageDurationMinutes ?? 0;
  const monthlyFreq = stats?.monthlyFrequency ?? 0;
  const totalWindowEntries = stats?.totalEntriesInWindow ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>3-Month Health Analytics</span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            Last 90 Days
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 3-Month Average Pain */}
        <StatCard
          title="3-Mo Avg Pain"
          value={avgPain > 0 ? `${avgPain}` : '0'}
          subtitle="Out of 10 scale"
          icon={<Flame className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
        />

        {/* Average Duration */}
        <StatCard
          title="Avg Duration"
          value={avgDuration > 0 ? formatDuration(avgDuration) : '0m'}
          subtitle="Per recorded episode"
          icon={<Clock className="w-5 h-5 text-teal-600" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/50"
        />

        {/* Monthly Frequency */}
        <StatCard
          title="Monthly Frequency"
          value={monthlyFreq > 0 ? `${monthlyFreq}` : '0'}
          subtitle="Episodes / month"
          icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/50"
        />

        {/* Total Window Episodes */}
        <StatCard
          title="Total Logged"
          value={totalWindowEntries}
          subtitle={`${stats?.weeklyFrequency ?? 0} episodes / week`}
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
        />
      </div>
    </div>
  );
}
