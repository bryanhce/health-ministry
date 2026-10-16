import React from 'react';
import { Card } from '@/frontend/components/ui/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
  badge,
}: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {value}
            </span>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
