'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { DashboardStatsDTO } from '@/frontend/domain/dashboard.types';
import { Card, CardHeader, CardBody } from '@/frontend/components/ui/Card';
import { formatDisplayDate } from '@/frontend/utils/dateUtils';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

export interface FrequencyChartsProps {
  stats?: DashboardStatsDTO;
}

export function FrequencyCharts({ stats }: FrequencyChartsProps) {
  if (!stats || stats.totalEntriesInWindow === 0) {
    return null;
  }

  const { monthlyTrends, recentTrends, severityBreakdown } = stats;

  const totalBreakdown =
    severityBreakdown.mild +
    severityBreakdown.moderate +
    severityBreakdown.severe +
    severityBreakdown.debilitating;

  const getPercent = (count: number) =>
    totalBreakdown > 0 ? Math.round((count / totalBreakdown) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Trends & Breakdown</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Frequency & Average Severity */}
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Monthly Episode Frequency
              </h3>
              <p className="text-xs text-slate-500">Recorded episodes per month</p>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis allowDecimals={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(value: unknown, name: unknown) => [
                      value as string | number,
                      String(name) === 'count' ? 'Episodes' : 'Avg Pain',
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#0d9488"
                    radius={[6, 6, 0, 0]}
                    name="Episodes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Severity Trend Line */}
        <Card className="overflow-hidden">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Pain Severity Trend
              </h3>
              <p className="text-xs text-slate-500">Timeline of recent episodes (1-10 scale)</p>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val: string) => {
                      const parts = val.split('-');
                      return `${parts[1]}/${parts[2]}`;
                    }}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis domain={[1, 10]} ticks={[2, 4, 6, 8, 10]} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    labelFormatter={(label: unknown) => formatDisplayDate(String(label))}
                    formatter={(value: unknown) => [`${value} / 10`, 'Pain Severity']}
                  />
                  <Line
                    type="monotone"
                    dataKey="painSeverity"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Severity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Severity Breakdown Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              3-Month Severity Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {totalBreakdown} total episodes
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden gap-0.5">
          {severityBreakdown.mild > 0 && (
            <div
              style={{ width: `${getPercent(severityBreakdown.mild)}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`Mild: ${severityBreakdown.mild} (${getPercent(severityBreakdown.mild)}%)`}
            />
          )}
          {severityBreakdown.moderate > 0 && (
            <div
              style={{ width: `${getPercent(severityBreakdown.moderate)}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Moderate: ${severityBreakdown.moderate} (${getPercent(severityBreakdown.moderate)}%)`}
            />
          )}
          {severityBreakdown.severe > 0 && (
            <div
              style={{ width: `${getPercent(severityBreakdown.severe)}%` }}
              className="bg-orange-500 h-full transition-all"
              title={`Severe: ${severityBreakdown.severe} (${getPercent(severityBreakdown.severe)}%)`}
            />
          )}
          {severityBreakdown.debilitating > 0 && (
            <div
              style={{ width: `${getPercent(severityBreakdown.debilitating)}%` }}
              className="bg-rose-600 h-full transition-all"
              title={`Debilitating: ${severityBreakdown.debilitating} (${getPercent(severityBreakdown.debilitating)}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              Mild (1-3): <strong className="text-slate-800 dark:text-slate-200">{severityBreakdown.mild}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              Moderate (4-6): <strong className="text-slate-800 dark:text-slate-200">{severityBreakdown.moderate}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              Severe (7-8): <strong className="text-slate-800 dark:text-slate-200">{severityBreakdown.severe}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">
              Debilitating (9-10): <strong className="text-slate-800 dark:text-slate-200">{severityBreakdown.debilitating}</strong>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
